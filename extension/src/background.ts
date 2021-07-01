import { Input, isInput } from "./input";
import { validate } from "jsonschema";

const port: browser.runtime.Port =
  browser.runtime.connectNative("themewatcher");

port.onDisconnect.addListener(() => {
  throw new Error("Native messenger disconnected.");
});

port.onMessage.addListener(async (msg) => {
  if ("data" in msg) {
    if (isInput(msg.data)) {
      await browser.storage.local.set({ input: msg.data });
      browser.theme.update(msg.data.theme);
    } else {
      // TODO: Present error to user properly.
      console.error(validate(msg.data, Input));
    }
  } else if ("error" in msg) {
    throw new Error(msg.error);
  } else {
    throw new Error("Native messenger sent malformed message.");
  }
});

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
