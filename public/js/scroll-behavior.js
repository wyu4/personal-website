const banner = document.getElementById('title-banner');
const scrollText = document.getElementById('scroll-text');
const content = document.getElementById('content');
const spacer = document.getElementById('spacer');

/**
 * Dynamicalyl update the position of the elements based on the page's scroll position
 */
function updateScroll() {
    const scrollY = window.scrollY;
    const scrollPercent = Math.min((scrollY / banner.scrollHeight) * 100, 100); // Percent of banner that would be covered by content

    content.style.transform = `translateY(${banner.scrollHeight-scrollY}px)`;
    content.style.opacity = Math.min(scrollPercent*0.03, 1);
    banner.style.filter = `blur(${scrollPercent*0.00005*banner.scrollWidth}px)`;
}

window.addEventListener('scroll', updateScroll);

/**
 * Dynamically update the spacer to enable proper scrolling
 */
function updateSpacer() {
    spacer.style.width = '100vw';
    spacer.style.height = `calc(${banner.scrollHeight + content.scrollHeight}px + 1cm)`;
}

window.addEventListener('load', () => {
    updateSpacer();
    updateScroll();
});
window.addEventListener('resize', updateSpacer);