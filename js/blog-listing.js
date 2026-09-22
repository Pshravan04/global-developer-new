document.addEventListener("DOMContentLoaded", () => {
    if (typeof BLOG_DATA === 'undefined') {
        console.error("BLOG_DATA not loaded. Make sure blog-data.js is included.");
        return;
    }

    const heroContainer = document.getElementById("blog-hero-container");
    const gridContainer = document.getElementById("blog-grid-container");
    const noResultsContainer = document.getElementById("no-results-msg");

    // Main render function
    function renderBlogs() {
        let filtered = BLOG_DATA;

        // Clear containers
        gridContainer.innerHTML = "";
        noResultsContainer.style.display = "none";

        if (filtered.length === 0) {
            noResultsContainer.style.display = "block";
            return;
        }

        // Render Editorial Grid (Uniform 3 columns)
        filtered.forEach((blog) => {
            const card = document.createElement("a");
            card.href = `blogs/${blog.slug}.html`;
            card.className = `editorial-card layout-third`;
            
            // Limit excerpt
            let displayExcerpt = blog.excerpt;
            displayExcerpt = displayExcerpt.length > 100 ? displayExcerpt.substring(0, 100) + '...' : displayExcerpt;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${blog.heroImage}" alt="${blog.imageAlt}">
                </div>
                <div class="editorial-card-content">
                    <h3 class="card-title">${blog.title}</h3>
                    <p>${displayExcerpt}</p>
                    <div class="card-author-meta">
                        <div class="author-avatar">
                            <img src="FNO LOGO MAIN.png" alt="FNO Global">
                        </div>
                        <div class="author-info">
                            <span class="author-name">FNO Editorial</span>
                            <span class="publish-date">• 18 Jan 2024</span>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }

    // Initialize
    renderBlogs();
});
