const path = await Deno.realPath(Deno.args[0] ?? "themewatch.json");

async function print() {
  await Deno.copy(
    await Deno.open(path),
    Deno.stdout,
  )
}

await print();

const watcher = Deno.watchFs(path);
for await (const event of watcher) {
  print();
}
