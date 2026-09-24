const fs = require('fs');
const template = fs.readFileSync('template.html', 'utf8');

const subpageStyles = `
<style>
    /* Subpage specific styles */
    .sp-section { padding: 80px 20px; background-color: #fff; }
    .sp-section.alt { background-color: #F8F9FA; }
    .sp-container { max-width: 1200px; margin: 0 auto; }
    .sp-header { text-align: center; margin-bottom: 60px; }
    .sp-title { font-size: 3rem; color: var(--color-primary); font-weight: 700; margin-bottom: 15px; }
    .sp-subtitle { font-size: 1.25rem; color: var(--color-accent); font-weight: 500; }
    .sp-text { font-size: 1.1rem; color: #444; line-height: 1.8; margin-bottom: 20px; }
    .sp-grid { display: grid; gap: 40px; }
    .sp-grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    .sp-grid-3 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    
    .sp-card { background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #eee; }
    .sp-card.alt { background: #F8F9FA; }
    .sp-card-title { font-size: 1.5rem; color: var(--color-primary); font-weight: 700; margin-bottom: 10px; }
    .sp-card-subtitle { color: var(--color-accent); font-weight: 600; margin-bottom: 15px; }
    
    .sp-profile { padding: 30px; }
    .sp-profile blockquote { font-style: italic; border-left: 4px solid var(--color-accent); padding-left: 15px; margin-top: 20px; color: #666; }
    
    .sp-cta-box { background: var(--color-primary); color: #fff; border-radius: 24px; padding: 60px 40px; text-align: center; }
    .sp-cta-box h2 { font-size: 2.5rem; margin-bottom: 20px; }
    .sp-cta-box p { font-size: 1.2rem; margin-bottom: 40px; opacity: 0.9; }
    .sp-btn-group { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
    .sp-btn { padding: 15px 40px; border-radius: 50px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.3s; }
    .sp-btn.primary { background: var(--color-accent); color: #fff; }
    .sp-btn.primary:hover { background: #047a02; }
    .sp-btn.secondary { background: #fff; color: var(--color-primary); }
    
    .sp-faq-item { background: #fff; border: 1px solid var(--color-accent); border-radius: 12px; margin-bottom: 15px; overflow: hidden; }
    .sp-faq-summary { padding: 20px; font-size: 1.2rem; font-weight: 600; color: var(--color-primary); cursor: pointer; display: flex; justify-content: space-between; }
    .sp-faq-content { padding: 0 20px 20px; color: #555; line-height: 1.6; }
    
    .sp-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
    @media(max-width: 768px) { .sp-contact-grid { grid-template-columns: 1fr; } }
    .sp-office { display: flex; gap: 20px; margin-bottom: 30px; }
    .sp-icon { width: 50px; height: 50px; background: #F8F9FA; border: 1px solid var(--color-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--color-accent); flex-shrink: 0; }
    .sp-input { width: 100%; padding: 15px; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 20px; font-family: inherit; }
    .sp-textarea { width: 100%; padding: 15px; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 20px; min-height: 120px; font-family: inherit; }
</style>
`;

const buildPage = (filename, title, content) => {
    let pageHtml = template.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
    pageHtml = pageHtml.replace('</head>', subpageStyles + '\n</head>');
    pageHtml = pageHtml.replace('<!-- CONTENT HERE -->', content);
    fs.writeFileSync(filename, pageHtml);
    console.log(`Created ${filename}`);
};

// 1. About Us
const aboutHtml = `
<section class="sp-section">
    <div class="sp-container">
        <div class="sp-header">
            <h1 class="sp-title">About FNO Global Developers</h1>
            <p class="sp-subtitle">Building with Vision. Growing with Trust.</p>
            <div style="max-width: 800px; margin: 30px auto;">
                <p class="sp-text">FNO Global Developers is a premium real estate development company founded in 2025 with a clear purpose: to create high-quality real estate destinations in promising locations.</p>
                <p class="sp-text">The company is new, but the experience behind it is not. Our promoters bring nearly four decades of knowledge across real estate, luxury construction, investments, business and value creation.</p>
                <p class="sp-text">This gives FNO Global Developers a strong foundation. We understand that real estate is not just about buying and selling property. It is about trust, timing, planning, quality and long-term confidence.</p>
            </div>
        </div>

        <div class="sp-grid sp-grid-2" style="margin-bottom: 80px;">
            <div class="sp-card alt">
                <h2 class="sp-card-title">What FNO Stands For</h2>
                <h3 class="sp-card-subtitle">Focused Nationwide Opportunities</h3>
                <p class="sp-text">FNO stands for Focused Nationwide Opportunities. The name reflects how we think. We focus on identifying strong real estate opportunities across India and developing them with purpose, planning and quality.</p>
                <p class="sp-text">Every project begins with a simple question: Can this location create real lifestyle value and long-term relevance for buyers? If the answer is yes, we move forward with care.</p>
            </div>
            <div class="sp-card alt">
                <h2 class="sp-card-title">Our Story</h2>
                <h3 class="sp-card-subtitle">A Young Company with a Strong Foundation</h3>
                <p class="sp-text">FNO Global Developers was started by promoters who understand real estate from experience. Our leadership brings together different strengths: real estate, construction, investments, business, entrepreneurship and global client servicing.</p>
                <p class="sp-text">We are not here to create ordinary developments. We are here to build premium real estate destinations that carry a sense of pride, comfort and trust.</p>
            </div>
        </div>

        <div class="sp-header">
            <h2 class="sp-title" style="font-size: 2.5rem;">Promoters and Leadership</h2>
            <p class="sp-subtitle">Led by Experience. Driven by a New Vision.</p>
        </div>
        
        <div class="sp-grid sp-grid-2" style="margin-bottom: 80px;">
            <div class="sp-card sp-profile">
                <h3 class="sp-card-title">Kunal Arora</h3>
                <p class="sp-card-subtitle" style="color: var(--color-accent);">Founder & Managing Director</p>
                <p class="sp-text">Kunal Arora is a young entrepreneur with a global outlook and experience working with international clients across diverse markets. His role focuses on vision, growth, brand direction, market expansion and creating opportunities that connect with today's premium buyers.</p>
                <blockquote>"A vision beyond borders, driven by ambition, built for global growth."</blockquote>
            </div>
            <div class="sp-card sp-profile">
                <h3 class="sp-card-title">Spice Bindal</h3>
                <p class="sp-card-subtitle" style="color: var(--color-accent);">Founder & Managing Director</p>
                <p class="sp-text">Spice Bindal brings strong experience in the construction industry along with a clear understanding of execution, quality and client expectations. His leadership is focused on precision, discipline, construction quality and creating developments that reflect trust and premium execution.</p>
                <blockquote>"Global standards begin with a vision for excellence and the discipline to deliver it."</blockquote>
            </div>
            <div class="sp-card sp-profile">
                <h3 class="sp-card-title">Jugal Arora</h3>
                <p class="sp-card-subtitle" style="color: var(--color-accent);">Founder & Chairman</p>
                <p class="sp-text">Jugal Arora brings over 30 years of experience in real estate, along with deep business understanding and strategic insight. His vision is rooted in building ventures that stand on trust, quality, responsibility and enduring value.</p>
                <blockquote>"Our ambition is not to follow benchmarks, but to set them."</blockquote>
            </div>
            <div class="sp-card sp-profile">
                <h3 class="sp-card-title">Suman Bindal</h3>
                <p class="sp-card-subtitle" style="color: var(--color-accent);">Founder & Chairman</p>
                <p class="sp-text">Suman Bindal brings over 30 years of distinguished experience in luxury and high-end construction. His experience strengthens FNO Global Developers' focus on premium detailing, refined construction and long-lasting value.</p>
                <blockquote>"True luxury lies in the details that stand the test of time."</blockquote>
            </div>
        </div>

        <div class="sp-cta-box">
            <h2>Creating Value That Lasts</h2>
            <p>At FNO Global Developers, we are not here to build short-term projects. We are here to create real estate destinations with a clear vision and long-term value.<br>Our commitment is simple: Build with trust. Plan with care. Deliver with quality.</p>
            <div class="sp-btn-group">
                <a href="upcoming-project.html" class="sp-btn primary">Explore Projects</a>
                <a href="contact-us.html" class="sp-btn secondary">Contact Our Team</a>
            </div>
        </div>
    </div>
</section>
`;

buildPage('about-us.html', 'About FNO Global Developers | Premium Real Estate Company in India', aboutHtml);

// 2. Upcoming Project
const projectHtml = `
<section class="sp-section">
    <div class="sp-container">
        <div class="sp-header">
            <span style="display:inline-block; padding: 5px 15px; background: var(--color-accent); color:#fff; border-radius: 20px; font-weight: 600; margin-bottom: 20px;">Coming Soon</span>
            <h1 class="sp-title">A Premium Villa Community by FNO Global Developers</h1>
            <p class="sp-text" style="max-width: 800px; margin: 0 auto 30px;">FNO Global Developers is preparing to introduce a premium villa community in North of Goa, planned for buyers who want luxury, privacy, open surroundings and strong connectivity.</p>
            <div class="sp-btn-group">
                <button class="sp-btn primary open-popup">Register Early Interest</button>
                <button class="sp-btn" style="border: 2px solid var(--color-primary); color: var(--color-primary);">Request a Call Back</button>
            </div>
        </div>

        <div class="sp-grid sp-grid-2" style="margin-bottom: 80px; align-items: center;">
            <div>
                <img src="assets/site-images/WhatsApp Image 2026-09-23 at 4.02.45 PM.jpeg" alt="North of Goa Villa" style="width: 100%; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            </div>
            <div>
                <h2 class="sp-title" style="font-size: 2.2rem;">Location Overview</h2>
                <div style="border-left: 4px solid var(--color-accent); padding-left: 20px; margin-bottom: 20px;">
                    <p style="font-size: 1.2rem; font-weight: 600; color: #333;">Opposite Aradhya Cinema, North of Goa, NH-66</p>
                </div>
                <p class="sp-text">The upcoming project is positioned on the NH-66 corridor, opposite Aradhya Cinema, in North of Goa. This location gives the project a strong access advantage. It is planned for people who want the peace of a villa community without feeling disconnected from important movement routes.</p>
                <ul style="list-style: none; padding: 0; margin-bottom: 30px;">
                    <li style="margin-bottom: 10px; font-size: 1.1rem; color: #444;"><span style="color: var(--color-accent); margin-right: 10px;">✓</span> Located in North of Goa</li>
                    <li style="margin-bottom: 10px; font-size: 1.1rem; color: #444;"><span style="color: var(--color-accent); margin-right: 10px;">✓</span> Direct NH-66 connectivity</li>
                    <li style="margin-bottom: 10px; font-size: 1.1rem; color: #444;"><span style="color: var(--color-accent); margin-right: 10px;">✓</span> Opposite Aradhya Cinema</li>
                    <li style="margin-bottom: 10px; font-size: 1.1rem; color: #444;"><span style="color: var(--color-accent); margin-right: 10px;">✓</span> Suitable for premium villa community planning</li>
                </ul>
                <a href="https://maps.app.goo.gl/BgnxaPXLv9nicDyk9?g_st=aw" target="_blank" style="color: var(--color-accent); font-weight: 600; text-decoration: none; font-size: 1.1rem;">View Location on Map ➔</a>
            </div>
        </div>

        <div class="sp-card alt" style="padding: 60px;">
            <div class="sp-header" style="margin-bottom: 40px;">
                <h2 class="sp-title" style="font-size: 2.5rem;">Project Vision</h2>
                <p class="sp-subtitle">A Villa Community Designed for a Better Way of Living</p>
            </div>
            
            <div class="sp-grid sp-grid-2">
                <div class="sp-card" style="padding: 30px;">
                    <h3 class="sp-card-title">Private Villa Living</h3>
                    <p class="sp-text">A community concept for buyers who value personal space and privacy.</p>
                </div>
                <div class="sp-card" style="padding: 30px;">
                    <h3 class="sp-card-title">Natural Surroundings</h3>
                    <p class="sp-text">A lifestyle setting inspired by greenery, open air and peaceful surroundings.</p>
                </div>
                <div class="sp-card" style="padding: 30px;">
                    <h3 class="sp-card-title">Premium Planning</h3>
                    <p class="sp-text">A development vision focused on comfort, design, movement and everyday usability.</p>
                </div>
                <div class="sp-card" style="padding: 30px;">
                    <h3 class="sp-card-title">Strong Connectivity</h3>
                    <p class="sp-text">Direct NH-66 connectivity adds convenience and long-term location relevance.</p>
                </div>
            </div>
        </div>
    </div>
</section>
`;

buildPage('upcoming-project.html', 'Upcoming Villa Community in North of Goa | FNO Global Developers', projectHtml);

// 3. Decoding Land
const decodingHtml = `
<section class="sp-section">
    <div class="sp-container">
        <div class="sp-header">
            <h1 class="sp-title">Decoding Destination-Led Real Estate</h1>
            <p class="sp-subtitle">Understanding Location, Lifestyle and Long-Term Value</p>
            <div style="max-width: 800px; margin: 30px auto;">
                <p class="sp-text">Good real estate is not only about what is being built. It is also about where it is being built, why that location matters, and how the area can support future demand.</p>
                <p class="sp-text">At FNO Global Developers, we study access, lifestyle demand, natural surroundings, tourism movement, planning quality and long-term relevance before shaping a project.</p>
            </div>
        </div>

        <div class="sp-grid sp-grid-3" style="margin-bottom: 80px;">
            <div class="sp-card alt" style="border-top: 4px solid var(--color-primary);">
                <h3 class="sp-card-title" style="font-size: 1.2rem;">1. Location Comes First</h3>
                <p class="sp-text" style="font-size: 1rem;">A strong location creates the foundation for buyer confidence. It affects access, usability, lifestyle value and future interest.</p>
            </div>
            <div class="sp-card alt" style="border-top: 4px solid var(--color-accent);">
                <h3 class="sp-card-title" style="font-size: 1.2rem;">2. Connectivity Adds Value</h3>
                <p class="sp-text" style="font-size: 1rem;">A peaceful villa community should still be easy to reach. Direct NH-66 connectivity gives the upcoming FNO project a strong access advantage.</p>
            </div>
            <div class="sp-card alt" style="border-top: 4px solid #B38F46;">
                <h3 class="sp-card-title" style="font-size: 1.2rem;">3. Lifestyle Demand Is Changing</h3>
                <p class="sp-text" style="font-size: 1rem;">People are looking for more space, greenery, privacy and better surroundings. This is why villa communities in destination-led locations are relevant.</p>
            </div>
            <div class="sp-card alt" style="border-top: 4px solid #B38F46;">
                <h3 class="sp-card-title" style="font-size: 1.2rem;">4. Experiences Add Value</h3>
                <p class="sp-text" style="font-size: 1rem;">Goa's movement towards wellness, heritage, food, workation and experience-led travel adds more depth to the destination.</p>
            </div>
            <div class="sp-card alt" style="border-top: 4px solid var(--color-primary);">
                <h3 class="sp-card-title" style="font-size: 1.2rem;">5. Quality Planning Matters</h3>
                <p class="sp-text" style="font-size: 1rem;">A premium project needs proper internal planning, landscaping, lighting, movement, safety and everyday comfort.</p>
            </div>
            <div class="sp-card alt" style="border-top: 4px solid var(--color-accent);">
                <h3 class="sp-card-title" style="font-size: 1.2rem;">6. Long-Term Thinking</h3>
                <p class="sp-text" style="font-size: 1rem;">Real estate should not be bought only because of hype. Buyers should look at location, access, developer vision, planning and long-term usability.</p>
            </div>
        </div>

        <div style="background: var(--color-primary); color: #fff; border-radius: 24px; display: flex; overflow: hidden; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px; padding: 60px;">
                <h2 style="font-size: 2.5rem; margin-bottom: 10px;">Why North of Goa</h2>
                <p style="color: #B38F46; font-size: 1.2rem; font-weight: 600; margin-bottom: 30px;">A Destination Moving Beyond Holidays</p>
                <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 20px; opacity: 0.9;">Goa is changing from a short holiday destination into a more complete lifestyle market. Tourism is becoming more experience-led, with focus areas like wellness, heritage, MICE, adventure, gastronomy and workation.</p>
                <p style="font-size: 1.1rem; line-height: 1.8; opacity: 0.9;">North of Goa offers that direction. It brings together the calm of nature, the appeal of coastal living, road connectivity and the larger lifestyle value associated with Goa.</p>
            </div>
            <div style="flex: 1; min-width: 300px;">
                <img src="assets/site-images/WhatsApp Image 2026-09-23 at 4.02.47 PM (1).jpeg" alt="North Goa Lifestyle" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
        </div>
    </div>
</section>
`;

buildPage('decoding-land.html', 'Decoding Destination-Led Real Estate | FNO Global Developers', decodingHtml);

// 4. FAQs
const faqHtml = `
<section class="sp-section alt">
    <div class="sp-container" style="max-width: 900px;">
        <div class="sp-header">
            <h1 class="sp-title">Frequently Asked Questions</h1>
            <p class="sp-subtitle">Find answers to common questions about FNO Global Developers, the upcoming villa community, and our vision.</p>
        </div>

        <div>
            <details class="sp-faq-item">
                <summary class="sp-faq-summary">1. What is FNO Global Developers? <span>+</span></summary>
                <div class="sp-faq-content">FNO Global Developers is a premium real estate development company founded in 2025. The company is backed by promoters with nearly four decades of experience in real estate, luxury construction, business, investments and value creation.</div>
            </details>
            <details class="sp-faq-item">
                <summary class="sp-faq-summary">2. What does FNO stand for? <span>+</span></summary>
                <div class="sp-faq-content">FNO stands for Focused Nationwide Opportunities. It reflects our vision to identify strong real estate opportunities across India and develop them with quality, planning and long-term thinking.</div>
            </details>
            <details class="sp-faq-item">
                <summary class="sp-faq-summary">3. Where is the upcoming FNO project located? <span>+</span></summary>
                <div class="sp-faq-content">The upcoming project is located opposite Aradhya Cinema, in North of Goa, with direct NH-66 connectivity.</div>
            </details>
            <details class="sp-faq-item">
                <summary class="sp-faq-summary">4. What type of project is coming soon? <span>+</span></summary>
                <div class="sp-faq-content">FNO Global Developers is preparing to introduce a premium villa community designed around privacy, natural surroundings, connectivity and refined living.</div>
            </details>
            <details class="sp-faq-item">
                <summary class="sp-faq-summary">5. Is this project open for bookings? <span>+</span></summary>
                <div class="sp-faq-content">The project is currently in the coming-soon stage. Interested buyers can register their early interest to receive updates and launch information.</div>
            </details>
            <details class="sp-faq-item">
                <summary class="sp-faq-summary">6. Why is North of Goa suitable for a villa community? <span>+</span></summary>
                <div class="sp-faq-content">North of Goa offers lifestyle appeal, road connectivity, tourism movement, natural surroundings and growing interest from buyers looking for destination-led real estate.</div>
            </details>
            <details class="sp-faq-item">
                <summary class="sp-faq-summary">7. What is the benefit of NH-66 connectivity? <span>+</span></summary>
                <div class="sp-faq-content">NH-66 connectivity gives the location better access and easier movement. For a villa community, this helps balance peaceful living with practical convenience.</div>
            </details>
        </div>
    </div>
</section>
`;

buildPage('faqs.html', 'FAQs | FNO Global Developers', faqHtml);

// 5. Contact Us
const contactHtml = `
<section class="sp-section">
    <div class="sp-container">
        <div class="sp-header">
            <h1 class="sp-title">Speak with FNO Global Developers</h1>
            <p class="sp-text" style="max-width: 700px; margin: 0 auto;">Whether you are exploring our upcoming villa community in North of Goa or want to know more about our real estate vision, our team will be happy to assist you.</p>
        </div>

        <div class="sp-contact-grid">
            <div>
                <h2 class="sp-title" style="font-size: 2rem; margin-bottom: 40px;">Office Locations</h2>
                
                <div class="sp-office">
                    <div class="sp-icon">📍</div>
                    <div>
                        <h3 class="sp-card-subtitle" style="font-size: 1.2rem;">Noida — Sector 62</h3>
                        <p class="sp-text" style="margin-bottom:0;">Office No. 123, Corranthan Building,<br>Sector 62, Noida, Uttar Pradesh</p>
                    </div>
                </div>
                
                <div class="sp-office">
                    <div class="sp-icon">📍</div>
                    <div>
                        <h3 class="sp-card-subtitle" style="font-size: 1.2rem;">Delhi — Krishna Nagar</h3>
                        <p class="sp-text" style="margin-bottom:0;">F-3/34, Vijay Chowk, Krishna Nagar,<br>East Delhi, New Delhi</p>
                        <p class="sp-text" style="margin-bottom:0; margin-top: 10px;">C-9/1, Sethi Building Chowk, Krishna Nagar,<br>East Delhi, New Delhi</p>
                    </div>
                </div>

                <div class="sp-office">
                    <div class="sp-icon">📍</div>
                    <div>
                        <h3 class="sp-card-subtitle" style="font-size: 1.2rem;">Goa — Porvorim</h3>
                        <p class="sp-text" style="margin-bottom:0;">Porvorim, Goa</p>
                    </div>
                </div>
            </div>

            <div class="sp-card alt">
                <h3 class="sp-card-title" style="font-size: 1.8rem; margin-bottom: 30px;">Send us a message</h3>
                <form>
                    <input type="text" class="sp-input" placeholder="Full Name *" required>
                    <input type="email" class="sp-input" placeholder="Email Address *" required>
                    <input type="tel" class="sp-input" placeholder="Phone Number *" required>
                    <input type="text" class="sp-input" placeholder="City *" required>
                    <select class="sp-input" required>
                        <option value="" disabled selected>Interested In *</option>
                        <option>Upcoming North of Goa Project</option>
                        <option>Completed Portfolio</option>
                        <option>Partnership</option>
                        <option>General Inquiry</option>
                    </select>
                    <textarea class="sp-textarea" placeholder="Message"></textarea>
                    <button type="submit" class="sp-btn primary" style="width: 100%; border: none; font-size: 1.1rem; cursor: pointer;">Send Message</button>
                </form>
            </div>
        </div>
    </div>
</section>
`;

buildPage('contact-us.html', 'Contact FNO Global Developers | Real Estate Developer in India', contactHtml);
