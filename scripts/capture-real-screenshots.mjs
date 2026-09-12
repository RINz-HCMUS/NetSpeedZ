import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const executablePath = '/app/applet/chrome-headless-shell/linux-153.0.8010.36/chrome-headless-shell-linux64/chrome-headless-shell';

async function run() {
  console.log('Launching browser with Chrome Headless Shell...');
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1400,920',
    ],
    defaultViewport: {
      width: 1400,
      height: 920,
      deviceScaleFactor: 2, // High resolution retina capture
    },
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Wait 2.5s for initial network info to load
  await new Promise((r) => setTimeout(r, 2500));

  console.log('Starting real speed test by clicking #start-speedtest-btn...');
  await page.click('#start-speedtest-btn');

  // Wait for stage to reach 'completed'
  console.log('Waiting for speed test to run (ping, download, upload)...');
  await page.waitForFunction(() => {
    const quality = document.querySelector('#quality-summary-card');
    const statusPill = document.querySelector('#speedtest-status-pill');
    return quality !== null || (statusPill && statusPill.textContent.includes('FINISHED'));
  }, { timeout: 90000 });

  console.log('Speed test completed! Waiting 2s for smooth animations to finish...');
  await new Promise((r) => setTimeout(r, 2000));

  const outDir = path.resolve('public/screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Full Dashboard Overview Screenshot (Top viewport)
  console.log('Capturing real-overview.png...');
  await page.screenshot({
    path: path.join(outDir, 'real-overview.png'),
    fullPage: false,
  });

  // 2. Speedometer section element screenshot
  console.log('Capturing real-speedometer.png...');
  const speedSection = await page.$('#speedtest-section');
  if (speedSection) {
    await speedSection.screenshot({
      path: path.join(outDir, 'real-speedometer.png'),
    });
  }

  // 3. Live Speed Chart element screenshot
  console.log('Capturing real-chart.png...');
  const chartEl = await page.$('#live-speed-chart-card');
  if (chartEl) {
    await chartEl.screenshot({
      path: path.join(outDir, 'real-chart.png'),
    });
  }

  // 4. Quality Assessment element screenshot
  console.log('Capturing real-quality.png...');
  const qualityEl = await page.$('#quality-summary-card');
  if (qualityEl) {
    await qualityEl.screenshot({
      path: path.join(outDir, 'real-quality.png'),
    });
  }

  // 5. Network info card element screenshot
  console.log('Capturing real-network.png...');
  const networkEl = await page.$('#network-info-card');
  if (networkEl) {
    await networkEl.screenshot({
      path: path.join(outDir, 'real-network.png'),
    });
  }

  // 6. History section element screenshot
  console.log('Capturing real-history.png...');
  const historyEl = await page.$('#history-section');
  if (historyEl) {
    await historyEl.screenshot({
      path: path.join(outDir, 'real-history.png'),
    });
  }

  console.log('Successfully captured all real screenshots of NetSpeedZ!');
  await browser.close();
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
