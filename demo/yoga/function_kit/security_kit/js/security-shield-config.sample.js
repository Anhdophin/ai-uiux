/*
  Sample config for Security Shield Kit.
  Copy this file and customize before using in production.
*/
window.SecurityShieldConfig = {
  autoStart: true,
  monitorMutations: true,
  scanForms: true,
  useReportConsole: true,
  backendUrl: 'http://127.0.0.1:8787',

  // Keep lists strict in production.
  allowedIframeHosts: [
    'www.youtube.com',
    'player.vimeo.com'
  ],
  allowedScriptHosts: [
    window.location.hostname,
    'www.googletagmanager.com'
  ],
  allowedImageHosts: [
    window.location.hostname,
    'images.unsplash.com'
  ],

  onThreatDetected: function (event) {
    // Optional backend logging endpoint.
    if (this.backendUrl) {
      fetch(this.backendUrl + '/api/security-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: event.type,
          details: event.details,
          page: window.location.href,
          level: 'warn'
        })
      }).catch(function () {
        // Ignore network failure in client logger.
      });
    }

    console.info('[SecurityShield event]', event.type);
  }
};
