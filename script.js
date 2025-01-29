document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Select all toggle buttons
document.querySelectorAll(".toggle-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const hiddenContent = this.nextElementSibling; // Get the next content div

    hiddenContent.style.display = hiddenContent.style.display === "block" ? "none" : "block";

    // Update button text based on visibility
    this.textContent = hiddenContent.style.display === "block" ? "Collapse Details" : "View More Details";
  });
});
