const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract header-inner
const headerInnerMatch = indexHtml.match(/(<div class="header-inner">[\s\S]*?<\/div>\s*)<\/header>/);
if (!headerInnerMatch) throw new Error("Could not find header-inner in index.html");
const headerInnerRaw = headerInnerMatch[1];

// Extract mobile menu
const mobileMenuMatch = indexHtml.match(/(<!-- Mobile Menu Overlay -->[\s\S]*?<div id="menu-backdrop" class="menu-backdrop"><\/div>)/);
if (!mobileMenuMatch) throw new Error("Could not find mobile menu in index.html");
const mobileMenuRaw = mobileMenuMatch[1];

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
    
    // Determine path depth
    const isRoot = !file.includes(path.sep);
    const prefix = isRoot ? 'index.html' : '../index.html';
    const logoPrefix = isRoot ? '' : '../';
    const blogsHtmlPath = isRoot ? 'blogs.html' : '../blogs.html';

    // Process header inner
    let headerInner = headerInnerRaw;
    // Replace hash links with index.html#link
    headerInner = headerInner.replace(/href="#/g, `href="${prefix}#`);
    // Replace blogs.html link
    headerInner = headerInner.replace(/href="blogs\.html"/g, `href="${blogsHtmlPath}"`);
    // Replace logo src
    headerInner = headerInner.replace(/src="FNO LOGO MAIN\.png"/g, `src="${logoPrefix}FNO LOGO MAIN.png"`);

    // Process mobile menu
    let mobileMenu = mobileMenuRaw;
    // Replace hash links with index.html#link
    mobileMenu = mobileMenu.replace(/href="#/g, `href="${prefix}#`);
    // Replace blogs.html link
    mobileMenu = mobileMenu.replace(/href="blogs\.html"/g, `href="${blogsHtmlPath}"`);

    // 1. Replace header-inner
    content = content.replace(/<div class="header-inner">[\s\S]*?<\/div>\s*<\/header>/, `${headerInner}</header>`);

    // 2. Add or replace mobile menu
    if (content.includes('<!-- Mobile Menu Overlay -->')) {
        content = content.replace(/<!-- Mobile Menu Overlay -->[\s\S]*?<div id="menu-backdrop" class="menu-backdrop"><\/div>/, mobileMenu);
    } else {
        // insert after </header>
        content = content.replace(/(<\/header>)/, `$1\n\n    ${mobileMenu}`);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
});
