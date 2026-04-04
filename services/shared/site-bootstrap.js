(function () {
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed to load script: " + src));
      document.head.appendChild(s);
    });
  }

  function getSharedBase() {
    const scripts = Array.from(document.getElementsByTagName("script"));
    const current = scripts.find((s) => s.src && s.src.includes("site-bootstrap.js"));
    if (!current) return null;
    return new URL("./", current.src).href;
  }

  window.SiteBootstrap = {
    init: async function () {
      const sharedBase = getSharedBase();
      if (!sharedBase) {
        console.error("Cannot detect shared base path.");
        return;
      }

      if (!window.SITE_CONFIG) {
        await loadScript(new URL("site-config.js", sharedBase).href);
      }

      if (!window.SiteEnv) {
        await loadScript(new URL("site-env.js", sharedBase).href);
      }
    }
  };
})();