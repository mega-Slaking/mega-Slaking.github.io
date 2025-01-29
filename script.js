document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Toggle Expand/Collapse Section for Projects
document.querySelector(".toggle-btn").addEventListener("click", function () {
  const hiddenContent = document.querySelector(".hidden-content");
    
  hiddenContent.style.display = hiddenContent.style.display === "block" ? "none" : "block";

  // Update button text based on visibility
  this.textContent = hiddenContent.style.display === "block" ? "Collapse Details" : "View More Details";
});
