import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";
import { writeFile, mkdir } from "node:fs/promises";
await mkdir("reports", { recursive: true });
for (const mode of ["mobile", "desktop"]) {
  const chrome = await launch({
    chromeFlags: ["--headless", "--no-sandbox", "--mute-audio"],
  });
  try {
    const result = await lighthouse(
      "http://127.0.0.1:3000",
      {
        port: chrome.port,
        output: ["json", "html"],
        logLevel: "error",
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
      mode === "desktop" ? desktopConfig : undefined,
    );
    if (!result) throw new Error("No Lighthouse result");
    await writeFile(`reports/lighthouse-${mode}.json`, result.report[0]);
    await writeFile(`reports/lighthouse-${mode}.html`, result.report[1]);
    console.log(
      mode,
      JSON.stringify(
        Object.fromEntries(
          Object.entries(result.lhr.categories).map(([name, cat]) => [
            name,
            Math.round(cat.score * 100),
          ]),
        ),
      ),
    );
    console.log(
      "metrics",
      JSON.stringify(
        Object.fromEntries(
          [
            "first-contentful-paint",
            "largest-contentful-paint",
            "total-blocking-time",
            "cumulative-layout-shift",
          ].map((k) => [k, result.lhr.audits[k].displayValue]),
        ),
      ),
    );
    console.log(
      "failures",
      JSON.stringify(
        Object.entries(result.lhr.audits)
          .filter(([, a]) => a.score !== null && a.score < 0.9)
          .map(([k, a]) => ({
            id: k,
            value: a.displayValue,
            details: a.details?.items?.slice(0, 4),
          })),
      ),
    );
  } finally {
    await chrome.kill();
  }
}
