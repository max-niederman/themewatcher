const form = document.getElementById("form");
const inputs = {
  source: document.getElementById("source"),
};

form.onsubmit = (e) => {
  e.preventDefault();
  browser.storage.local.set({
    source: inputs.source.value,
  });
  alert("Applied and saved.");
};

(async () => {
  inputs.source.value = (await browser.storage.local.get("source"))["source"] ?? "";
})();
