const banner = document.getElementById('title-banner');
const content = document.getElementById('content');
const spacer = document.getElementById('spacer');

function updateScroll() {
    const scrollY = window.scrollY;
    const bannerHeight = banner.scrollHeight;
    banner.style.transform = `translateY(-${scrollY}px)`;
    if (scrollY >= bannerHeight) {
        content.style.transform = `translateY(-${scrollY - bannerHeight}px)`;
    } else {
        content.style.transform = 'translateY(0px)';
    }
}

window.addEventListener('scroll', updateScroll);

// Spacer to enable scrolling
function updateSpacer() {
    spacer.style.width = '100vw';

    spacer.style.height = `${banner.scrollHeight + Math.max(screen.height, content.scrollHeight)}px`;
}

window.addEventListener('load', () => {
    updateSpacer();
    updateScroll();
});
window.addEventListener('resize', updateSpacer);