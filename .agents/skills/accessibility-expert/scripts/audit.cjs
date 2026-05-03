const { AxePuppeteer } = require("@axe-core/puppeteer");
const puppeteer = require("puppeteer");
const fs = require('fs');

async function runAudit(url, outputPath = 'a11y-report.json') {
  console.log(`Starting accessibility audit for: ${url}`);
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: "networkidle2" });

    console.log("Analyzing with axe-core...");
    const results = await new AxePuppeteer(page)
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    const report = {
      url,
      timestamp: new Date().toISOString(),
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map((n) => ({
          html: n.html,
          target: n.target,
          failureSummary: n.failureSummary,
        })),
      })),
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length,
    };

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`Audit complete. Report saved to ${outputPath}`);
    
    if (report.violations.length > 0) {
      console.log(`Found ${report.violations.length} violations.`);
    } else {
      console.log("No violations found! Great job.");
    }

    return report;
  } catch (error) {
    console.error("Audit failed:", error);
  } finally {
    await browser.close();
  }
}

// Usage: node audit.js <url> [output-path]
const url = process.argv[2] || 'http://localhost:5173';
const output = process.argv[3];
runAudit(url, output);
