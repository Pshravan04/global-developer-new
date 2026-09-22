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
            if (fullPath.endsWith('.html') && fullPath !== 'index.html') {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walkDir('.');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove the inline style from the header tag
    const newContent = content.replace(/<header id="header" class="site-header" style="[^"]*">/g, '<header id="header" class="site-header">');

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated', file);
    }
});
