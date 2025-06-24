import { init } from './detect_audio.js';

document.addEventListener('DOMContentLoaded', () => {
    let stream = null;
    let audioElement = null;

    const detectBtn = document.getElementById('detect');
    const bars = [
        document.getElementById('bar1'),
        document.getElementById('bar2'),
        document.getElementById('bar3'),
        document.getElementById('bar4'),
        document.getElementById('bar5')
    ];

    function changeBars(...percentages) {
        for (let i = 0; i < percentages.length; i++) {
            try {
                const barLength = 5 + Math.floor(percentages[i] * 40);
                bars[i].style.height = `${barLength}%`;
            } catch (err) {
                console.error(err);
            }
        }
    }

    async function beginAudioInput() {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioElement = document.createElement('audio');
        audioElement.srcObject = stream;
        audioElement.play();

        let scores = [];

        document.addEventListener('ScoresUpdate', (e) => {
            console.log(e.detail);
            scores.push(e.detail.scores);
        });

        const timeout = 10_000;
        init(timeout);
        setTimeout(() => {
            endAudioInput();
            clearInterval(barGeneration);
            changeBars(
                0, 
                0, 
                0, 
                0, 
                0
            );   
        }, timeout);
    }

    async function endAudioInput() {
        stream.getTracks().forEach(track => track.stop());
        audioElement.pause();
        audioElement.srcObject = null;
        stream = null;
        audioElement = null;
    }

    function toggleBarState() {
        if (stream === null) {
            beginAudioInput();
            barGeneration = setInterval(() => {
                changeBars(
                    Math.random(), 
                    Math.random(), 
                    Math.random(), 
                    Math.random(), 
                    Math.random()
                );
            }, 150);
        }
    }

    let barGeneration;

    detectBtn.addEventListener('mousedown', () => {
        if (stream === null) {
            beginAudioInput();
            barGeneration = setInterval(() => {
                changeBars(
                    Math.random(), 
                    Math.random(), 
                    Math.random(), 
                    Math.random(), 
                    Math.random()
                );
            }, 150);
        } else {
            endAudioInput();
            clearInterval(barGeneration);
            changeBars(
                0, 
                0, 
                0, 
                0, 
                0
            );
        }
    });
});