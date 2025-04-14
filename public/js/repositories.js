const panel = document.getElementById('repositories');

function load() {
    panel.innerHTML = 'Loading repositories';
}

window.addEventListener('load', load);