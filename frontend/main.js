function randomMusicGenerate(htmlBar) {
    const randomNum = 5 + Math.floor(Math.random() * 40);
    htmlBar.style.height = `${randomNum}%`;
}

document.addEventListener('DOMContentLoaded', () => {
    const bar1 = document.getElementById('bar1');
    const bar2 = document.getElementById('bar2');
    const bar3 = document.getElementById('bar3');
    const bar4 = document.getElementById('bar4');
    const bar5 = document.getElementById('bar5');

    setInterval(() => {
        randomMusicGenerate(bar1);
        randomMusicGenerate(bar2);
        randomMusicGenerate(bar3);
        randomMusicGenerate(bar4);
        randomMusicGenerate(bar5);

    }, 150);
});