const mammoth = require("mammoth");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const blogsDir = path.join(__dirname, "..", "blogs");
const outputJsPath = path.join(__dirname, "..", "js", "blog-data.js");
const outputJsonPath = path.join(__dirname, "blogs.json"); // For debugging

async function parseDocx(filePath, filename) {
    console.log(`Parsing ${filename}...`);
    const result = await mammoth.convertToHtml({ path: filePath });
    let html = result.value;
    
    // Some basic cleanup of mammoth html
    html = html.replace(/<p><\/p>/g, "");

    const dom = new JSDOM(`<!DOCTYPE html><html><body>${html}</body></html>`);
    const document = dom.window.document;
    const body = document.body;

    let blog = {
        id: filename.split("_")[0], // e.g. "01"
        sourceFile: filename,
        title: "",
        excerpt: "",
        heroImage: "",
        seoTitle: "",
        metaDesc: "",
        slug: "",
        category: "",
        focusKeywords: "",
        imageAlt: "",
        content: "",
        cta: "",
        faqs: []
    };

    // Extract title (first text element)
    const pElements = Array.from(body.querySelectorAll("p, h1, h2, h3, h4, h5, h6"));
    
    // Find Title
    blog.title = pElements[0].textContent.trim();

    // Find Featured Image and Excerpt
    for (let p of pElements) {
        let text = p.textContent.trim();
        if (text.startsWith("Featured image:")) {
            // we already have the standard image name format mapping
        }
        if (text.startsWith("Excerpt:")) {
            blog.excerpt = text.replace("Excerpt:", "").trim();
        }
    }
    
    // Extract ALL embedded images from the document
    const imgElements = Array.from(body.querySelectorAll("img"));
    let imageCounter = 1;
    
    imgElements.forEach((imgElement, index) => {
        if (imgElement.src.startsWith("data:image/")) {
            const src = imgElement.src;
            const matches = src.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
            if (matches) {
                const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
                const buffer = Buffer.from(matches[2], 'base64');
                const imageName = `${blog.id}_${blog.slug || 'img'}_${imageCounter}.${ext}`;
                const imagePath = path.join(__dirname, "..", "assets", "images", "blogs", imageName);
                
                // Ensure directory exists
                fs.mkdirSync(path.dirname(imagePath), { recursive: true });
                fs.writeFileSync(imagePath, buffer);
                
                const finalImgPath = `assets/images/blogs/${imageName}`;
                
                if (index === 0) {
                    // First image is Hero Image
                    blog.heroImage = finalImgPath;
                    imgElement.remove(); // Remove from content
                } else {
                    // Subsequent images are content images
                    imgElement.src = `../${finalImgPath}`;
                    // Wrap in figure with breakout class
                    const figure = document.createElement('figure');
                    figure.className = 'image-breakout';
                    imgElement.parentNode.insertBefore(figure, imgElement);
                    figure.appendChild(imgElement);
                }
                imageCounter++;
            }
        }
    });

    if (!blog.heroImage) {
        blog.heroImage = "assets/images/blogs/default_hero.jpg";
    }
    
    // Table (SEO details)
    const table = body.querySelector("table");
    if (table) {
        const rows = table.querySelectorAll("tr");
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 2) {
                const key = cells[0].textContent.trim();
                const value = cells[1].textContent.trim();
                if (key === "SEO Title") blog.seoTitle = value;
                if (key === "Meta Description") blog.metaDesc = value;
                if (key === "Suggested URL Slug") {
                    blog.slug = value.replace(/^\//, ""); // remove leading slash
                }
                if (key === "Category") blog.category = value;
                if (key === "Focus Keywords") blog.focusKeywords = value;
                if (key === "Featured Image Alt Text") blog.imageAlt = value;
            }
        });
    } else {
        console.warn(`No table found in ${filename}`);
    }

    // Now extract content
    // We find "Article Content", "Suggested CTA", "FAQs for This Article", "Source Notes"
    let inContent = false;
    let inCTA = false;
    let inFAQs = false;

    let contentHtml = [];
    let currentFaqQ = "";
    let currentFaqA = "";
    
    body.childNodes.forEach(node => {
        const text = node.textContent ? node.textContent.trim() : "";
        if (text === "Article Content") {
            inContent = true; return;
        }
        if (text === "Suggested CTA" || text === "Suggested CTA ") {
            inContent = false; inCTA = true; return;
        }
        if (text === "FAQs for This Article" || text.includes("FAQs for This")) {
            inCTA = false; inFAQs = true; return;
        }
        if (text.startsWith("Source Notes") || text.startsWith("Publishing Safety")) {
            inFAQs = false; return;
        }

        if (inContent) {
            if (node.nodeName !== "TABLE") {
                // If it's a short paragraph that looks like a strong statement, make it an editorial highlight
                if (node.nodeName === "P" && text.length > 40 && text.length < 150) {
                    // Condition: contains numbers/percentages, or starts with a quote, or is wrapped in bold
                    if (text.match(/\d+%|\d+ lakh|\d+ crore/i) || text.startsWith("“") || text.startsWith("\"")) {
                        const div = document.createElement("div");
                        div.className = "editorial-highlight";
                        div.innerHTML = node.innerHTML;
                        contentHtml.push(div.outerHTML);
                        return; // Skip normal pushing
                    }
                }
                
                // Keep the HTML tag structure
                if (node.outerHTML) {
                    contentHtml.push(node.outerHTML);
                }
            }
        }
        
        if (inFAQs) {
            // Simple logic: Q is usually a paragraph with question mark or bold? 
            // In these docx files, they are just paragraphs. Let's look for ?
            if (node.outerHTML && text !== "") {
                if (text.endsWith("?")) {
                    if (currentFaqQ && currentFaqA) {
                        blog.faqs.push({ q: currentFaqQ, a: currentFaqA.trim() });
                    }
                    currentFaqQ = text;
                    currentFaqA = "";
                } else {
                    currentFaqA += text + " ";
                }
            }
        }
    });

    if (currentFaqQ && currentFaqA) {
        blog.faqs.push({ q: currentFaqQ, a: currentFaqA.trim() });
    }

    // Convert contentHtml array to string and do some light cleanup
    blog.content = contentHtml.join("\n").replace(/<strong>/g, '<b>').replace(/<\/strong>/g, '</b>');
    
    // Convert first paragraphs to H2 if they look like headings
    // This is simple formatting
    blog.content = blog.content.replace(/<p>([^<.>]{10,60})<\/p>/g, function(match, p1) {
        // If it has no punctuation and is short, make it an H2
        if (!p1.includes('.') && p1.length > 10 && p1.length < 70) {
            return `<h2>${p1}</h2>`;
        }
        return match;
    });

    // Add author, date and read time logic
    blog.date = "September 24, 2026";
    blog.author = "FNO Editorial Team";
    blog.readTime = Math.ceil(blog.content.split(" ").length / 200) + " min read";

    return blog;
}

async function main() {
    const files = fs.readdirSync(blogsDir).filter(f => f.endsWith(".docx"));
    const allBlogs = [];
    
    for (let file of files) {
        const filePath = path.join(blogsDir, file);
        const blogData = await parseDocx(filePath, file);
        allBlogs.push(blogData);
    }

    // Sort by id
    allBlogs.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    fs.writeFileSync(outputJsonPath, JSON.stringify(allBlogs, null, 2));
    
    // Generate JS file
    const jsContent = `// Auto-generated blog data\nconst BLOG_DATA = ${JSON.stringify(allBlogs, null, 2)};\n`;
    fs.mkdirSync(path.join(__dirname, "..", "js"), { recursive: true });
    fs.writeFileSync(outputJsPath, jsContent);
    
    console.log("Successfully extracted blogs and saved to js/blog-data.js");
}

main().catch(console.error);
