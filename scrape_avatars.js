const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

(async () => {
    console.log('Starting puppeteer...');
    // We use a public puppeteer if available, or just install it
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    console.log('Navigating to page...');
    await page.goto('https://yai-plan-production.up.railway.app/plan', { waitUntil: 'networkidle2' });
    
    // Check if we are on the login page by looking for the access-code input
    const accessCodeInput = await page.$('#access-code');
    if (accessCodeInput) {
        console.log('Found login form. Entering access code...');
        await accessCodeInput.type('012026');
        
        // Find the submit button and click it
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) {
            await Promise.all([
                submitButton.click(),
                page.waitForNavigation({ waitUntil: 'networkidle0' })
            ]);
            console.log('Logged in successfully!');
        } else {
            console.log('Could not find submit button.');
        }
    } else {
        console.log('No login form found, maybe already logged in or page structure different.');
    }

    // Now extract the avatars and module names
    console.log('Extracting modules...');
    const modules = await page.evaluate(() => {
        // We look for all images
        const imgs = document.querySelectorAll('img');
        const results = [];
        
        imgs.forEach(img => {
            // Find the parent container to get the text
            // Typically an avatar and text are siblings or in a small container
            const container = img.closest('div, a'); // Might need adjustment based on DOM
            if (container && container.innerText) {
                // The text might be the module name
                const text = container.innerText.trim();
                if (text && text.length > 0) {
                    results.push({ name: text.split('\n')[0], url: img.src });
                }
            } else {
                results.push({ name: 'Unknown_' + Math.random().toString(36).substring(7), url: img.src });
            }
        });
        return results;
    });

    console.log(`Found ${modules.length} images.`);
    fs.writeFileSync('extracted_modules.json', JSON.stringify(modules, null, 2));

    // Optional: download images
    const downloadDir = path.join(__dirname, 'public', 'avatars');
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
    }

    // Get cookies to pass to https.get if needed
    const cookies = await page.cookies();
    const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    console.log('Downloading images...');
    for (let mod of modules) {
        if (!mod.url.startsWith('http')) continue;
        
        const safeName = mod.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'avatar';
        const ext = mod.url.split('.').pop().split('?')[0] || 'png';
        const destPath = path.join(downloadDir, `${safeName}.${ext}`);
        
        // We can just download via node
        await new Promise((resolve, reject) => {
            const req = https.get(mod.url, { headers: { 'Cookie': cookieString } }, (res) => {
                if (res.statusCode === 200) {
                    const file = fs.createWriteStream(destPath);
                    res.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve();
                    });
                } else {
                    console.log(`Failed to download ${mod.url}: ${res.statusCode}`);
                    resolve();
                }
            });
            req.on('error', (err) => {
                console.log(`Error downloading ${mod.url}: ${err.message}`);
                resolve();
            });
        });
        console.log(`Downloaded ${safeName}.${ext}`);
    }

    console.log('Done!');
    await browser.close();
})();
