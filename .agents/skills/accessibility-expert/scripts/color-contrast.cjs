const puppeteer = require("puppeteer");

async function analyzeContrast(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    const issues = await page.evaluate(() => {
      function relativeLuminance(rgb) {
        const [r, g, b] = rgb.map(val => {
          val = val / 255;
          return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }

      function calculateContrast(fg, bg) {
        const l1 = relativeLuminance(parseColor(fg));
        const l2 = relativeLuminance(parseColor(bg));
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }

      function parseColor(color) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
      }

      return Array.from(document.querySelectorAll('*'))
        .filter(el => el.innerText && el.innerText.trim() && el.offsetParent !== null)
        .map(el => {
          const styles = window.getComputedStyle(el);
          const fg = styles.color;
          const bg = styles.backgroundColor === 'transparent' || styles.backgroundColor === 'rgba(0, 0, 0, 0)' 
            ? 'rgb(255, 255, 255)' // Simplified assumption
            : styles.backgroundColor;
          
          const contrast = calculateContrast(fg, bg);
          const fontSize = parseFloat(styles.fontSize);
          const fontWeight = styles.fontWeight;
          const isLarge = fontSize >= 24 || (fontSize >= 18.66 && parseInt(fontWeight) >= 700);
          const threshold = isLarge ? 3 : 4.5;

          if (contrast < threshold) {
            return {
              text: el.innerText.trim().substring(0, 30),
              tag: el.tagName,
              contrast: contrast.toFixed(2),
              required: threshold,
              fg,
              bg
            };
          }
          return null;
        })
        .filter(Boolean);
    });

    console.log(`Contrast Analysis for ${url}:`);
    if (issues.length === 0) {
      console.log("No contrast issues found.");
    } else {
      console.table(issues);
    }
    
    return issues;
  } finally {
    await browser.close();
  }
}

const url = process.argv[2] || 'http://localhost:5173';
analyzeContrast(url);
