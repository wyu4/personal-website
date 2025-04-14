const banner = document.getElementById('title-banner');
const content = document.getElementById('content');
const spacer = document.getElementById('spacer');

/**
 * Get the banner height with an offset
 * @returns Banner Scroll-Height with additional height
 */
function getBannerHeight() {
    return banner.scrollHeight * 1.15;
}

/**
 * Dynamicalyl update the position of the elements based on the page's scroll position
 */
function updateScroll() {
    const scrollY = window.scrollY;
    const bannerHeight = getBannerHeight();
    banner.style.transform = `translateY(-${scrollY}px)`;
    if (scrollY >= bannerHeight) {
        content.style.transform = `translateY(-${scrollY - bannerHeight}px)`;
    } else {
        content.style.transform = 'translateY(0px)';
    }
}

window.addEventListener('scroll', updateScroll);

/**
 * Dynamically update the spacer to enable proper scrolling
 */
function updateSpacer() {
    spacer.style.width = '100vw';
    spacer.style.height = `${getBannerHeight() + Math.max(screen.height, content.scrollHeight)}px`;
}

window.addEventListener('load', () => {
    updateSpacer();
    updateScroll();
});
window.addEventListener('resize', updateSpacer);