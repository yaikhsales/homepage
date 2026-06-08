const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log('Starting puppeteer...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    console.log('Navigating to page...');
    await page.goto('https://yai-plan-production.up.railway.app/plan', { waitUntil: 'networkidle2' });
    
    const accessCodeInput = await page.$('#access-code');
    if (accessCodeInput) {
        console.log('Found login form. Entering access code...');
        await accessCodeInput.type('012026');
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) {
            await Promise.all([
                submitButton.click(),
                page.waitForNavigation({ waitUntil: 'networkidle0' })
            ]);
            console.log('Logged in successfully!');
        }
    }

    // Now extract descriptions by clicking each agent.
    console.log('Extracting descriptions...');
    const results = [];
    
    // Get all image elements that might be avatars
    // We can evaluate in browser context to do the clicking and extracting
    const extractedData = await page.evaluate(async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        const data = [];
        
        // Find all images that have src containing 'agent' or are in the modules section
        // We'll just try to click every image and see if a modal opens.
        const imgs = document.querySelectorAll('img');
        
        for (let img of imgs) {
            if (!img.src.includes('agent-') && !img.src.includes('generated')) continue; // skip non-agent images like logos
            
            // Try clicking the image's parent or the image itself
            const clickable = img.closest('button, a, div[class*="cursor-pointer"], div[onclick]') || img;
            
            // Click it
            clickable.click();
            await sleep(500); // wait for modal animation
            
            // Look for a modal. Usually a fixed positioned div or dialog.
            // Let's just find the text that looks like a description.
            // The modal has text like "Draft — tell me this agent's real role..."
            // Or we can find the close button (SVG X icon)
            const modalTitle = document.querySelector('h2, h3, .text-xl, .text-2xl, .font-bold'); 
            
            // A more robust way: find the text that contains "I run the whole" or similar.
            // Let's find the largest visible text block that isn't the main page text.
            // Actually, we can just grab all text from the body and diff it, or look for the modal container.
            // Let's assume the modal has a specific role="dialog" or class="fixed"
            const dialog = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0');
            
            if (dialog) {
                const titleEl = dialog.querySelector('h2, h3, .text-xl, .font-bold:not(.text-sm)');
                const title = titleEl ? titleEl.innerText.trim() : '';
                
                // The description is likely the longest text node or a p tag
                const pTags = Array.from(dialog.querySelectorAll('p, div.text-base, div.leading-relaxed'));
                let desc = '';
                for (let p of pTags) {
                    const text = p.innerText.trim();
                    // Avoid the "Draft..." text and the category "ADMINISTRATION..."
                    if (text && text.length > 20 && !text.includes('Draft —')) {
                        if (text.length > desc.length) desc = text; // get the longest paragraph
                    }
                }
                
                data.push({
                    src: img.src,
                    title: title,
                    description: desc
                });
                
                // Close modal
                const closeBtn = dialog.querySelector('button');
                if (closeBtn) closeBtn.click();
                else {
                    // Try sending escape key
                    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}));
                }
                await sleep(400); // wait for close animation
            }
        }
        return data;
    });

    console.log(`Extracted ${extractedData.length} descriptions.`);
    fs.writeFileSync('extracted_descriptions.json', JSON.stringify(extractedData, null, 2));

    console.log('Done!');
    await browser.close();
})();
