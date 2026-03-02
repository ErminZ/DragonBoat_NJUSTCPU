// Gallery: video click handling only - Lightbox removed (handled inline in index.html)
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".gallery-item[data-type=\"video\"]").forEach(item => {
        item.addEventListener("click", (e) => {
            if (e.target.tagName === "VIDEO" || e.target.closest("video")) {
                e.stopPropagation();
            }
        });
    });
});
