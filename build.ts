import { load } from "npm:cheerio";

const res = await fetch("https://myanimelist.net/apiconfig/references/api/v2");

const data = await res.text();

const $ = load(data);

// find const __redoc_state =  <some JSON>
$("script").each((i, el) => {
  const script = $(el).html();
  if (script && script.includes("const __redoc_state = ")) {
    const start =
      script.indexOf("const __redoc_state = ") +
      "const __redoc_state = ".length;
    const end = script.indexOf("};", start) + 1;
    const jsonString = script.substring(start, end);

    const jsObject = JSON.parse(jsonString);

    Deno.writeTextFileSync(
      "openapi.json",
      JSON.stringify(jsObject.spec.data, null, 2)
    );
  }
});
