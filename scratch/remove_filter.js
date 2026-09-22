const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else { 
            if (file.endsWith('.html')) results.push(file);
        }
    });
    return results;
}

const files = walkDir('.');
let replacedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/style="filter: brightness\(0\.2\) sepia\(1\) hue-rotate\(150deg\) saturate\(3\);"/g, '');
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        replacedCount++;
        console.log('Updated filter in', file);
    }
});
console.log('Total files updated:', replacedCount);
