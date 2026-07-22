/*
  Security Shield Kit
  Reusable front-end protection layer for static/dynamic landing pages.
*/
(function (global) {
  'use strict';

  var DEFAULT_CONFIG = {
    blockTags: ['script', 'object', 'embed', 'applet'],
    blockAttributePrefixes: ['on'],
    blockProtocols: ['javascript:', 'vbscript:', 'data:text/html'],
    allowedIframeHosts: [],
    allowedScriptHosts: [],
    allowedImageHosts: [],
    scanDocumentOnStart: false,
    monitorMutations: true,
    scanForms: true,
    quietEventTypes: ['shield_started', 'shield_stopped'],
    dedupeReports: true,
    dedupeWindowMs: 1200,
    useReportConsole: true,
    onThreatDetected: null
  };

  var SUSPICIOUS_PATTERNS = [
    /<\s*script/gi,
    /on\w+\s*=+/gi,
    /javascript\s*:/gi,
    /vbscript\s*:/gi,
    /data\s*:\s*text\/html/gi,
    /<\s*iframe/gi,
    /document\.(cookie|write)/gi,
    /window\.(location|open)\s*=+/gi,
    /fetch\s*\(\s*['\"]https?:\/\//gi,
    /\beval\s*\(/gi,
    /\bFunction\s*\(/gi
  ];

  function mergeConfig(base, override) {
    var output = {};
    var key;

    for (key in base) {
      if (Object.prototype.hasOwnProperty.call(base, key)) {
        output[key] = base[key];
      }
    }

    if (!override) return output;

    for (key in override) {
      if (Object.prototype.hasOwnProperty.call(override, key)) {
        output[key] = override[key];
      }
    }

    return output;
  }

  function toArray(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  function normalizeHostList(hostList) {
    return toArray(hostList)
      .map(function (host) {
        return String(host || '').trim().toLowerCase();
      })
      .filter(Boolean);
  }

  function normalizeProtocolList(protocolList) {
    return toArray(protocolList)
      .map(function (protocol) {
        return String(protocol || '').trim().toLowerCase();
      })
      .filter(Boolean);
  }

  function createThreatReporter(config) {
    var recentEventMap = Object.create(null);

    return function report(type, details) {
      if (toArray(config.quietEventTypes).indexOf(type) !== -1) {
        return;
      }

      var payload = {
        type: type,
        details: details || {},
        timestamp: new Date().toISOString()
      };

      if (config.dedupeReports) {
        var key = type + '|' + JSON.stringify(payload.details);
        var now = Date.now();
        var dedupeWindowMs = Number(config.dedupeWindowMs || 0);
        var lastSeen = recentEventMap[key] || 0;

        if (dedupeWindowMs > 0 && now - lastSeen < dedupeWindowMs) {
          return;
        }

        recentEventMap[key] = now;
      }

      if (config.useReportConsole) {
        console.warn('[SecurityShield]', payload);
      }

      if (typeof config.onThreatDetected === 'function') {
        try {
          config.onThreatDetected(payload);
        } catch (error) {
          console.error('[SecurityShield] onThreatDetected failed', error);
        }
      }
    };
  }

  function parseUrl(url) {
    try {
      return new URL(url, window.location.origin);
    } catch (error) {
      return null;
    }
  }

  function startsWithAny(value, candidates) {
    var i;
    for (i = 0; i < candidates.length; i += 1) {
      if (value.indexOf(candidates[i]) === 0) return true;
    }
    return false;
  }

  function isHostAllowed(urlObject, allowList) {
    if (!allowList.length) return true;
    return allowList.indexOf(urlObject.hostname.toLowerCase()) !== -1;
  }

  function isProtocolBlocked(rawUrl, blockedProtocols) {
    var value = String(rawUrl || '').trim().toLowerCase();
    if (!value) return false;
    return startsWithAny(value, blockedProtocols);
  }

  function isUrlSafe(rawUrl, blockedProtocols) {
    if (isProtocolBlocked(rawUrl, blockedProtocols)) return false;

    var parsed = parseUrl(rawUrl);
    if (!parsed) return false;

    var safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    return safeProtocols.indexOf(parsed.protocol) !== -1;
  }

  function removeDangerousAttributes(element, config, report) {
    var attrs = Array.prototype.slice.call(element.attributes || []);
    var i;

    for (i = 0; i < attrs.length; i += 1) {
      var attr = attrs[i];
      var name = String(attr.name || '').toLowerCase();
      var value = String(attr.value || '');

      if (!name) continue;

      if (config.blockAttributePrefixes.some(function (prefix) { return name.indexOf(prefix) === 0; })) {
        element.removeAttribute(attr.name);
        report('removed_event_attribute', { tag: element.tagName, attribute: attr.name });
        continue;
      }

      if ((name === 'href' || name === 'src' || name === 'xlink:href') && !isUrlSafe(value, config.blockProtocols)) {
        element.removeAttribute(attr.name);
        report('removed_unsafe_url_attribute', { tag: element.tagName, attribute: attr.name, value: value });
      }
    }
  }

  function shouldRemoveNode(node, config, report) {
    if (!node || node.nodeType !== 1) return false;

    var tagName = String(node.tagName || '').toLowerCase();

    if (config.blockTags.indexOf(tagName) !== -1) {
      report('blocked_tag', { tag: tagName });
      return true;
    }

    if (tagName === 'iframe') {
      var src = node.getAttribute('src') || '';
      var url = parseUrl(src);
      if (!url || !isHostAllowed(url, config.allowedIframeHosts)) {
        report('blocked_iframe_host', { src: src });
        return true;
      }
    }

    if (tagName === 'img') {
      var imgSrc = node.getAttribute('src') || '';
      if (imgSrc) {
        var imgUrl = parseUrl(imgSrc);
        if (!imgUrl || !isUrlSafe(imgSrc, config.blockProtocols)) {
          report('blocked_image_url', { src: imgSrc });
          return true;
        }

        if (!isHostAllowed(imgUrl, config.allowedImageHosts)) {
          report('blocked_image_host', { src: imgSrc });
          return true;
        }
      }
    }

    if (tagName === 'script') {
      var scriptSrc = node.getAttribute('src') || '';
      if (!scriptSrc) {
        report('blocked_inline_script_node', {});
        return true;
      }

      var scriptUrl = parseUrl(scriptSrc);
      if (!scriptUrl || !isHostAllowed(scriptUrl, config.allowedScriptHosts)) {
        report('blocked_script_host', { src: scriptSrc });
        return true;
      }
    }

    return false;
  }

  function sanitizeNodeTree(rootNode, config, report) {
    if (!rootNode) return;

    var walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT, null);
    var toRemove = [];

    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (shouldRemoveNode(node, config, report)) {
        toRemove.push(node);
      } else {
        removeDangerousAttributes(node, config, report);
      }
    }

    toRemove.forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
  }

  function sanitizeHTML(html, config, report) {
    var parser = new DOMParser();
    var parsed = parser.parseFromString(String(html || ''), 'text/html');
    sanitizeNodeTree(parsed.body, config, report);
    return parsed.body.innerHTML;
  }

  function hasSuspiciousPayload(value) {
    var text = String(value || '');
    return SUSPICIOUS_PATTERNS.some(function (pattern) {
      pattern.lastIndex = 0;
      return pattern.test(text);
    });
  }

  function protectForm(form, report) {
    form.addEventListener('submit', function (event) {
      var fields = Array.prototype.slice.call(form.querySelectorAll('input, textarea, select'));
      var foundThreat = false;

      fields.forEach(function (field) {
        var value = String(field.value || '');
        if (hasSuspiciousPayload(value)) {
          foundThreat = true;
          field.classList.add('is-security-blocked');
          report('blocked_form_payload', {
            field: field.name || field.id || 'unknown',
            valuePreview: value.slice(0, 160)
          });
        } else {
          field.classList.remove('is-security-blocked');
        }
      });

      if (foundThreat) {
        event.preventDefault();
      }
    });
  }

  function protectAllForms(report) {
    var forms = Array.prototype.slice.call(document.querySelectorAll('form'));
    forms.forEach(function (form) {
      protectForm(form, report);
    });
  }

  function attachMutationGuard(config, report) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        var added = Array.prototype.slice.call(mutation.addedNodes || []);
        added.forEach(function (node) {
          if (node.nodeType !== 1) return;

          if (shouldRemoveNode(node, config, report)) {
            if (node.parentNode) node.parentNode.removeChild(node);
            return;
          }

          removeDangerousAttributes(node, config, report);
          sanitizeNodeTree(node, config, report);
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: false
    });

    return observer;
  }

  function SecurityShield(userConfig) {
    this.config = mergeConfig(DEFAULT_CONFIG, userConfig || {});
    this.config.allowedIframeHosts = normalizeHostList(this.config.allowedIframeHosts);
    this.config.allowedScriptHosts = normalizeHostList(this.config.allowedScriptHosts);
    this.config.allowedImageHosts = normalizeHostList(this.config.allowedImageHosts);
    this.config.blockProtocols = normalizeProtocolList(this.config.blockProtocols);
    this.report = createThreatReporter(this.config);
    this.mutationObserver = null;
    this.started = false;
  }

  SecurityShield.prototype.start = function start() {
    if (this.started) return;

    if (this.config.scanDocumentOnStart) {
      sanitizeNodeTree(document.documentElement, this.config, this.report);
    }

    if (this.config.scanForms) {
      protectAllForms(this.report);
    }

    if (this.config.monitorMutations) {
      this.mutationObserver = attachMutationGuard(this.config, this.report);
    }

    this.started = true;
    this.report('shield_started', {
      scanDocumentOnStart: this.config.scanDocumentOnStart,
      monitorMutations: this.config.monitorMutations,
      scanForms: this.config.scanForms
    });
  };

  SecurityShield.prototype.stop = function stop() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    this.started = false;
    this.report('shield_stopped', {});
  };

  SecurityShield.prototype.sanitizeHtml = function sanitizeHtmlPublic(html) {
    return sanitizeHTML(html, this.config, this.report);
  };

  SecurityShield.prototype.setSafeHtml = function setSafeHtml(target, html) {
    if (!target) return;
    target.innerHTML = sanitizeHTML(html, this.config, this.report);
  };

  SecurityShield.prototype.isSafeUrl = function isSafeUrlPublic(url) {
    return isUrlSafe(url, this.config.blockProtocols);
  };

  SecurityShield.prototype.openSafe = function openSafe(url, target) {
    if (!this.isSafeUrl(url)) {
      this.report('blocked_open_unsafe_url', { url: url });
      return false;
    }

    window.open(url, target || '_blank', 'noopener');
    return true;
  };

  SecurityShield.prototype.navigateSafe = function navigateSafe(url) {
    if (!this.isSafeUrl(url)) {
      this.report('blocked_navigate_unsafe_url', { url: url });
      return false;
    }

    window.location.assign(url);
    return true;
  };

  function create(userConfig) {
    return new SecurityShield(userConfig || {});
  }

  global.SecurityShieldKit = {
    create: create,
    hasSuspiciousPayload: hasSuspiciousPayload
  };

  var autoConfig = global.SecurityShieldConfig;
  if (autoConfig && autoConfig.autoStart === true) {
    document.addEventListener('DOMContentLoaded', function () {
      var shield = create(autoConfig);
      shield.start();
      global.__securityShieldInstance = shield;
    });
  }
})(window);
