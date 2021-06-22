const port: browser.runtime.Port = browser.runtime.connectNative("themewatcher");
port.onMessage.addListener(console.log);
port.onDisconnect.addListener(() => console.log("Disconnected"));

(async () => {
  await port.postMessage({
    source: (await browser.storage.local.get("source"))["source"],
  });

  browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && "source" in changes) {
      port.postMessage({ source: changes["source"].newValue });
    }
  });
})();
