import { Input, isInput } from "./input";

function apply(input: any) {
  if (isInput(input)) {
    Object.entries(input.variables).forEach(([name, value]) =>
      document.documentElement.style.setProperty(name, value)
    );
  }
}

(async () => {
  apply((await browser.storage.local.get("input"))["input"]);

  browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && "input" in changes) {
      apply(changes["input"]);
    }
  });
})();
