const fs = require('fs');
const path = require('path');
const https = require('https');

// Extract cookies from the previous script run if possible, or just download without cookies if they are public.
// Wait, we know the URL: https://yai-plan-production.up.railway.app/images/generated/agent-1.png
const downloadDir = path.join(__dirname, 'public', 'IMG', 'avatars');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

// Read the previously extracted modules to get the URLs and download them by their original file name.
const modules = JSON.parse(fs.readFileSync('extracted_modules.json', 'utf-8'));

const downloaded = new Set();

const downloadImage = (url, filename) => {
    return new Promise((resolve) => {
        const destPath = path.join(downloadDir, filename);
        const req = https.get(url, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(destPath);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
        req.on('error', () => resolve(false));
    });
};

(async () => {
    for (let mod of modules) {
        if (!mod.url.startsWith('http')) continue;
        
        // Extract filename from URL (e.g., agent-1.png)
        const urlObj = new URL(mod.url);
        const filename = path.basename(urlObj.pathname);
        
        if (filename && !downloaded.has(filename)) {
            downloaded.add(filename);
            console.log(`Downloading ${filename}...`);
            await downloadImage(mod.url, filename);
        }
    }
    console.log('Finished downloading original images!');
})();
