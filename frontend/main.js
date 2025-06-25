import { init } from './detect_audio.js';

let scores = [];

function calculateLikelySong() {
    if (!scores.length > 0) return 'Too little data';
    
    let labels = scores[0].labels;
    let totalVals = [];
    let valCount = 0;

    for (let i = 0; i < scores.length; i++) {
        if (JSON.stringify(labels) !== JSON.stringify(scores[i].labels)) return 'Invalid lables';
        let values = scores[i].labels;
        for (let j = 0; j < values.length; j++) {
            totalVals[j] += values[j];
        }
        valCount++;
    }

    let meanValTuples = totalVals.map((val, i) => {
        return {
            'title': labels[i], 
            'score': val / valCount
        }
    });
    
    return meanValTuples;
}

document.addEventListener('DOMContentLoaded', () => {
    let stream = null;
    let audioElement = null;
    let autoOff = false;
    let timeout = null;
    let barGeneration;

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

        scores = [];

        document.addEventListener('ScoresUpdate', (e) => {
            console.log(e.detail);
            scores.push(e.detail.scores);
        });

        const timeoutTime = 10_000;
        init(timeoutTime);
        autoOff = true;

        setTimeout(finaliseInput, timeoutTime);
    }

    async function finaliseInput() {
        const haltEvent = new CustomEvent('ListeningHalt');
        document.dispatchEvent(haltEvent);
        autoOff = true;
        await endAudioInput();
        clearInterval(barGeneration);
        changeBars(
            0, 
            0, 
            0, 
            0, 
            0
        );
        console.log();
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
        } else {
            //clearTimeout(timeout);
            finaliseInput();
        }
    }

    detectBtn.addEventListener('mousedown', toggleBarState);
});