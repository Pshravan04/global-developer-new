const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('assets')) {
                results = results.concat(walkDir(fullPath));
            }
        } else {
            if (fullPath.endsWith('.html')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walkDir('.');
let count = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the one with specific inline styles (blogs pages)
    let newContent = content.replace(/<button class="pill-btn open-popup" style="background: var\(--color-primary\); color: var\(--color-white\)">Register Your Interest<\/button>/g, 
        '<button class="pill-btn open-popup" style="background-color: var(--color-accent); color: var(--color-primary);">Register Your Interest</button>');
        
    // Replace the one in luxe-heaven-villas header
    newContent = newContent.replace(/<button class="pill-btn open-popup" onclick="document.getElementById\('enquiry-popup'\).showModal\(\)">Register Your Interest<\/button>/g, 
        '<button class="pill-btn open-popup" style="background-color: var(--color-accent); color: var(--color-primary);" onclick="document.getElementById(\'enquiry-popup\').showModal()">Register Your Interest</button>');

    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated', file);
        count++;
    }
});
console.log('Total files updated:', count);
