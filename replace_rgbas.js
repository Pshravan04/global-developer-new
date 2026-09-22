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
            if (fullPath.endsWith('.css') || fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
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
    
    // Replace old rgba colors
    // rgba(2, 38, 103, ...) -> rgba(2, 38, 103, ...)
    let newContent = content.replace(/rgba\(\s*26\s*,\s*60\s*,\s*52\s*,/g, 'rgba(2, 38, 103,');
    
    // rgba(2, 38, 103, ...) -> rgba(2, 38, 103, ...)
    newContent = newContent.replace(/rgba\(\s*10\s*,\s*34\s*,\s*32\s*,/g, 'rgba(2, 38, 103,');
    
    // rgba(255, 255, 255, ...) -> rgba(255, 255, 255, ...)
    newContent = newContent.replace(/rgba\(\s*254\s*,\s*253\s*,\s*208\s*,/g, 'rgba(255, 255, 255,');

    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated', file);
        count++;
    }
});
console.log('Total files updated:', count);
