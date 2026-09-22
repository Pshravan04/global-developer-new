const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "..", "blog-template.html");
const blogsJsonPath = path.join(__dirname, "blogs.json");
const outputDir = path.join(__dirname, "..", "blogs");

function buildBlogs() {
    if (!fs.existsSync(blogsJsonPath)) {
        console.error("blogs.json not found! Run parse_blogs.js first.");
        return;
    }
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const template = fs.readFileSync(templatePath, "utf-8");
    const blogs = JSON.parse(fs.readFileSync(blogsJsonPath, "utf-8"));

    blogs.forEach(blog => {
        let html = template;
        
        // Generate FAQs HTML
        let faqsHtml = "";
        if (blog.faqs && blog.faqs.length > 0) {
            faqsHtml = '<div class="blog-faqs"><h3>Frequently Asked Questions</h3>';
            blog.faqs.forEach(faq => {
                faqsHtml += `
                <div class="faq-item">
                    <div class="faq-q">${faq.q}</div>
                    <div class="faq-a">${faq.a}</div>
                </div>`;
            });
            faqsHtml += '</div>';
        }

        // Replace placeholders
        html = html.replace(/\{\{seoTitle\}\}/g, blog.seoTitle || blog.title);
        html = html.replace(/\{\{metaDesc\}\}/g, blog.metaDesc || blog.excerpt);
        html = html.replace(/\{\{title\}\}/g, blog.title);
        html = html.replace(/\{\{date\}\}/g, blog.date);
        html = html.replace(/\{\{author\}\}/g, blog.author);
        html = html.replace(/\{\{category\}\}/g, blog.category);
        html = html.replace(/\{\{heroImage\}\}/g, blog.heroImage);
        html = html.replace(/\{\{imageAlt\}\}/g, blog.imageAlt);
        html = html.replace(/\{\{readTime\}\}/g, blog.readTime);
        html = html.replace(/\{\{content\}\}/g, blog.content);
        html = html.replace(/\{\{faqs\}\}/g, faqsHtml);

        const outputPath = path.join(outputDir, `${blog.slug}.html`);
        fs.writeFileSync(outputPath, html, "utf-8");
        console.log(`Generated: blogs/${blog.slug}.html`);
    });

    console.log("All blogs generated successfully!");
}

buildBlogs();
