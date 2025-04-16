const langImage = document.getElementById('github-lang-stats');

function updateLangImage() {
    const API_VERTICAL = 'https://github-readme-stats.vercel.app/api/top-langs/?username=wyu4&langs_count=14&theme=graywhite&layout=donut-vertical';
    const API_HORIZONTAL = 'https://github-readme-stats.vercel.app/api/top-langs/?username=wyu4&langs_count=14&theme=graywhite&layout=donut'

    if (window.innerWidth < 1000) {
        langImage.src = API_HORIZONTAL;
    } else {
        langImage.src = API_HORIZONTAL;
    }
}

window.addEventListener('load', updateLangImage);
window.addEventListener('change', updateLangImage);