// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
const currentURL = window.location.href;
const TM_URL = currentURL + "my_model/";

async function createModel() {
    const checkpointURL = TM_URL + "model.json"; // model topology
    const metadataURL = TM_URL + "metadata.json"; // model metadata
    console.log(checkpointURL, metadataURL)

    const recognizer = speechCommands.create(
        "BROWSER_FFT", // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
}

export async function init(timeout) {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels

    /*
    const labelContainer = document.getElementById("label-container");
    for (let i = 0; i < classLabels.length; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
    */

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer.listen(result => {
        // render the probability scores per class
        const scoresEvent = new CustomEvent('ScoresUpdate', {
            detail: { 
                labels: classLabels,
                scores: result.scores
            }
        });
        document.dispatchEvent(scoresEvent);

        /*
        for (let i = 0; i < classLabels.length; i++) {
            const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
        */

    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    document.addEventListener('ListeningHalt', () => {
        recognizer.stopListening();
        console.log('finished');
    });
}