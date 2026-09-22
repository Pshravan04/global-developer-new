const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split(/\r?\n/);

let startIndex = -1;
let endIndex = -1;
let insertionIndex = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<!-- 08 & 09 UPCOMING PROJECT (CARD STYLE) -->')) {
        startIndex = i;
    }
    // We want the </section> just before <!-- 10 DESTINATION-LED REAL ESTATE -->
    if (lines[i].includes('<!-- 10 DESTINATION-LED REAL ESTATE -->')) {
        endIndex = i - 2; // the </section> is 2 lines above
    }
    if (lines[i].includes('<!-- 03C CREATIVE MARQUEE -->')) {
        insertionIndex = i;
    }
}

console.log('Start index:', startIndex);
console.log('End index:', endIndex);
console.log('Insertion index:', insertionIndex);

if (startIndex !== -1 && endIndex !== -1 && insertionIndex !== -1) {
    const extractedLines = lines.splice(startIndex, endIndex - startIndex + 1);
    
    // Recalculate insertion index since lines were removed before it if startIndex < insertionIndex
    // Wait, startIndex is ~366, insertionIndex is ~200.
    // So insertionIndex is unaffected by the splice.
    
    lines.splice(insertionIndex, 0, ...extractedLines, '');
    
    fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
    console.log('Move successful!');
} else {
    console.log('Failed to find indices');
}
