const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

const BASE_URL = 'https://iprd-erp.vercel.app';

// Screenshot configuration
const screenshots = [
  {
    name: '01-login-page.png',
    url: `${BASE_URL}/login`,
    waitFor: 2000,
    fullPage: true
  },
  {
    name: '02-dashboard.png',
    url: `${BASE_URL}/dashboard`,
    waitFor: 3000,
    fullPage: true,
    login: true // Need to login first
  },
  {
    name: '03-content-upload.png',
    url: `${BASE_URL}/add-content`,
    waitFor: 2000,
    fullPage: true,
    login: true
  },
  {
    name: '04-video-library.png',
    url: `${BASE_URL}/video-library`,
    waitFor: 2000,
    fullPage: true,
    login: true
  },
  {
    name: '05-library.png',
    url: `${BASE_URL}/video-library`,
    waitFor: 2000,
    fullPage: true,
    login: true,
    action: async (page, delayFn) => {
      // Click on "View All Content" or "📁 View All Content" button
      try {
        const buttons = await page.$$('button');
        for (const button of buttons) {
          const text = await page.evaluate(el => el.textContent, button);
          if (text.includes('View All Content') || text.includes('📁')) {
            await button.click();
            await delayFn(1500);
            break;
          }
        }
      } catch (e) {
        console.log('Could not click library view button, continuing...');
      }
    }
  },
  {
    name: '06-search.png',
    url: `${BASE_URL}/search`,
    waitFor: 2000,
    fullPage: true,
    login: true
  },
  {
    name: '07-content-sharing.png',
    url: `${BASE_URL}/share`,
    waitFor: 2000,
    fullPage: true,
    login: true
  },
  {
    name: '08-master-settings.png',
    url: `${BASE_URL}/master-settings`,
    waitFor: 2000,
    fullPage: true,
    login: true
  },
  {
    name: '09-reports.png',
    url: `${BASE_URL}/reports`,
    waitFor: 3000,
    fullPage: true,
    login: true
  },
  {
    name: '10-audit-logs.png',
    url: `${BASE_URL}/audit-logs`,
    waitFor: 2000,
    fullPage: true,
    login: true
  },
  {
    name: '11-settings.png',
    url: `${BASE_URL}/settings`,
    waitFor: 2000,
    fullPage: true,
    login: true
  },
  {
    name: '12-mobile-view.png',
    url: `${BASE_URL}/dashboard`,
    waitFor: 2000,
    fullPage: true,
    login: true,
    viewport: { width: 375, height: 667, deviceScaleFactor: 2 } // iPhone size
  },
  {
    name: '13-bilingual.png',
    url: `${BASE_URL}/dashboard`,
    waitFor: 2000,
    fullPage: true,
    login: true
  },
  {
    name: '14-branding.png',
    url: `${BASE_URL}/dashboard`,
    waitFor: 2000,
    fullPage: true,
    login: true
  }
];

async function login(page) {
  try {
    // Go to login page
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await delay(1500);

    // Helper: click button by text using XPath (Puppeteer doesn't support :has-text)
    const clickButtonByText = async (text) => {
      const [btn] = await page.$x(`//button[contains(normalize-space(.), ${JSON.stringify(text)})]`);
      if (btn) {
        await btn.click();
        return true;
      }
      return false;
    };

    // Try guest/continue as guest
    if (await clickButtonByText('Continue as Guest') || await clickButtonByText('Guest')) {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
      await delay(1500);
    } else {
      // Fallback: select a role (pick first non-placeholder option)
      const hasSelect = await page.$('select');
      if (hasSelect) {
        await page.evaluate(() => {
          const sel = document.querySelector('select');
          if (sel) {
            const opt = Array.from(sel.options).find(o => o.value && o.value.toLowerCase() !== '');
            if (opt) sel.value = opt.value;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
        await delay(500);
      }

      // Type a generic username if an input is present
      const username = await page.$('input[type="text"], input[placeholder*="name" i]');
      if (username) {
        await username.click({ clickCount: 3 }).catch(() => {});
        await username.type('Admin', { delay: 20 });
        await delay(300);
      }

      // Click Login/Submit
      if (!(await clickButtonByText('Login'))) {
        const submit = await page.$('button[type="submit"]');
        if (submit) await submit.click();
      }
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
      await delay(1500);
    }

    // If still on login, throw to signal failure
    const current = page.url();
    if (current.includes('/login')) {
      throw new Error('Still on login page after attempt');
    }
  } catch (error) {
    console.log('Login attempt issue:', error.message);
    await delay(1000);
  }
}

async function takeScreenshots() {
  console.log('🚀 Starting screenshot capture...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  let loggedIn = false;

  for (let i = 0; i < screenshots.length; i++) {
    const config = screenshots[i];
    console.log(`📸 Taking screenshot ${i + 1}/14: ${config.name}`);

    try {
      // Login if needed
      if (config.login && !loggedIn) {
        await login(page);
        loggedIn = true;
        await delay(1000);
      }

      // Set viewport if specified
      if (config.viewport) {
        await page.setViewport(config.viewport);
      } else {
        await page.setViewport({ width: 1920, height: 1080 });
      }

      // Navigate to page (re-login if redirected)
      await page.goto(config.url, { waitUntil: 'networkidle2' });
      await delay(config.waitFor || 2000);
      if (page.url().includes('/login') && config.login) {
        await login(page);
        await delay(800);
        await page.goto(config.url, { waitUntil: 'networkidle2' });
        await delay(config.waitFor || 2000);
      }

      // Perform any custom actions
      if (config.action) {
        await config.action(page, delay);
      }

      // Take screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, config.name),
        fullPage: config.fullPage !== false
      });

      console.log(`✅ Saved: ${config.name}\n`);
    } catch (error) {
      console.error(`❌ Error capturing ${config.name}:`, error.message);
      console.log('Continuing with next screenshot...\n');
    }
  }

  await browser.close();
  console.log('🎉 All screenshots captured!');
  console.log(`📁 Screenshots saved in: ${screenshotsDir}`);
}

// Run the script
takeScreenshots().catch(console.error);

