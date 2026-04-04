(function () {
  function getHomeUrl() {
    const path = (window.SITE_CONFIG && window.SITE_CONFIG.homePath) || "/";
    return new URL(path, window.location.origin).href;
  }

  function getToolsRootUrl() {
    const path = (window.SITE_CONFIG && window.SITE_CONFIG.toolsRootPath) || "/micro-tools/";
    return new URL(path, window.location.origin).href;
  }

  function goHome() {
    window.location.href = getHomeUrl();
  }

  function goToolsRoot() {
    window.location.href = getToolsRootUrl();
  }

  function goBackSmart() {
    const ref = document.referrer;

    if (ref) {
      try {
        const refUrl = new URL(ref);
        if (refUrl.origin === window.location.origin) {
          window.location.href = ref;
          return;
        }
      } catch (e) {}
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    goHome();
  }

  window.SiteEnv = {
    getHomeUrl,
    getToolsRootUrl,
    goHome,
    goToolsRoot,
    goBackSmart
  };
})();