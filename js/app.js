// Global Configuration
const FORMSPREE_FORM_ID = "YOUR_FORMSPREE_FORM_ID"; // Replace this with your actual Formspree ID

document.addEventListener("DOMContentLoaded", () => {
    // 1. Slideshow Carousel Logic
    let slideIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    let slideInterval;

    function showSlides(index) {
        if (slides.length === 0) return;
        
        if (index >= slides.length) { slideIndex = 0; }
        else if (index < 0) { slideIndex = slides.length - 1; }
        else { slideIndex = index; }

        slides.forEach(slide => slide.classList.remove("active"));
        if (dots.length > 0) {
            dots.forEach(dot => dot.classList.remove("active"));
        }

        slides[slideIndex].classList.add("active");
        if (dots.length > 0) {
            dots[slideIndex].classList.add("active");
        }
    }

    window.changeSlide = function(n) {
        clearInterval(slideInterval);
        showSlides(slideIndex + n);
        startAutoSlide();
    };

    window.currentSlide = function(n) {
        clearInterval(slideInterval);
        showSlides(n);
        startAutoSlide();
    };

    function startAutoSlide() {
        slideInterval = setInterval(() => {
            showSlides(slideIndex + 1);
        }, 6000);
    }

    if (slides.length > 0) {
        showSlides(slideIndex);
        startAutoSlide();
    }

    // 2. Accordion Toggle
    const accordions = document.querySelectorAll(".accordion-header");
    accordions.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            item.classList.toggle("active");
            
            const indicator = header.querySelector("span");
            if (indicator) {
                indicator.textContent = item.classList.contains("active") ? "-" : "+";
            }
        });
    });

    // 3. Formspree Contact / Inquiry Form Integration
    const leadForm = document.getElementById("leadForm");
    const responseMsg = document.getElementById("responseMessage");

    if (leadForm) {
        leadForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            if (responseMsg) {
                responseMsg.textContent = "Submitting, please wait...";
                responseMsg.style.color = "var(--accent-gold)";
            }

            const formData = {
                fullName: document.getElementById("fullName")?.value || "",
                phone: document.getElementById("phone")?.value || "",
                email: document.getElementById("email")?.value || "",
                message: document.getElementById("message")?.value || "",
                nationality: document.getElementById("nationality")?.value || "N/A",
                coverAmount: document.getElementById("coverAmount")?.value || "N/A"
            };

            try {
                if (!FORMSPREE_FORM_ID || FORMSPREE_FORM_ID === "YOUR_FORMSPREE_FORM_ID") {
                    throw new Error("Formspree ID is not configured.");
                }

                const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json' 
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    if (responseMsg) {
                        responseMsg.textContent = "Thank you! Your message has been sent.";
                        responseMsg.style.color = "#c5a059";
                    }
                    leadForm.reset();
                } else {
                    throw new Error("Submission failed.");
                }
            } catch (err) {
                console.error("Formspree failed, falling back to WhatsApp:", err);
                if (responseMsg) {
                    responseMsg.textContent = "Connecting via WhatsApp...";
                }
                setTimeout(() => {
                    const waText = encodeURIComponent(`Hi, my name is ${formData.fullName}. ${formData.message}`);
                    window.location.href = `https://wa.me/+27-72-498-0295?text=${waText}`;
                }, 1500);
            }
        });
    }

    // 4. Formspree Footer Newsletters Integration
    const newsletterBoxes = document.querySelectorAll(".newsletter-box");
    newsletterBoxes.forEach(box => {
        box.addEventListener("submit", async (e) => {
            e.preventDefault();
            const inputField = box.querySelector(".newsletter-input");
            const submitBtn = box.querySelector(".newsletter-btn");
            if (!inputField || !submitBtn) return;

            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "...";
            submitBtn.disabled = true;

            try {
                if (!FORMSPREE_FORM_ID || FORMSPREE_FORM_ID === "YOUR_FORMSPREE_FORM_ID") {
                    throw new Error("Formspree configuration error.");
                }

                const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json' 
                    },
                    body: JSON.stringify({ 
                        email: inputField.value, 
                        subject: "New Newsletter Subscriber" 
                    })
                });

                if (response.ok) {
                    submitBtn.textContent = "SUBSCRIBED!";
                    inputField.value = "";
                } else {
                    throw new Error("Failed response");
                }
            } catch (err) {
                console.error("Newsletter submission failed:", err);
                submitBtn.textContent = "FAILED";
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    });
});