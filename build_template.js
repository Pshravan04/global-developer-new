const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const headMatch = html.match(/<!DOCTYPE html>[\s\S]*?<\/head>/i);
const headerMatch = html.match(/<header id="header"[\s\S]*?<\/header>[\s\S]*?<div id="menu-backdrop" class="menu-backdrop"><\/div>/i);
const footerMatch = html.match(/<footer class="footer-advanced">[\s\S]*?<\/html>/i);

if(headMatch && headerMatch && footerMatch) {
    let head = headMatch[0];
    let header = headerMatch[0];
    let footer = footerMatch[0];
    
    header = header.replace(/href="#home"/g, 'href="index.html"')
                   .replace(/href="#about"/g, 'href="about-us.html"')
                   .replace(/href="#project"/g, 'href="upcoming-project.html"')
                   .replace(/href="#destination"/g, 'href="decoding-land.html"')
                   .replace(/href="#faq"/g, 'href="faqs.html"')
                   .replace(/href="#contact"/g, 'href="contact-us.html"');

    const template = (content) => head + '\n<body>\n' + header + '\n<main style="padding-top: 100px;">\n' + content + '\n</main>\n' + footer;

    fs.writeFileSync('template.html', template('<!-- CONTENT HERE -->'));
    console.log('Template created!');
} else {
    console.log('Failed to extract parts.');
    console.log(!!headMatch, !!headerMatch, !!footerMatch);
}

