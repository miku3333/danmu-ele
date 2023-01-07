const { SpeechSynthesizer, AudioConfig, SpeechConfig, ResultReason } = require('microsoft-cognitiveservices-speech-sdk');
const player = require('node-wav-player');
const { PLAY } = require('./constants');

const subscriptionKey = 'c13ac91e6f4b44d48a8121a7925992a4';
const serviceRegion = 'eastasia';
const filename = './file.wav';

const queue = [];

const play = text => {
    if (!text) {
        return;
    }
    const audioConfig = AudioConfig.fromAudioFileOutput(filename);
    const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    speechConfig.speechSynthesisVoiceName = 'zh-CN-XiaoshuangNeural';
    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakTextAsync(
        text,
        function (result) {
            if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                console.log('synthesis finished.');
                synthesizer.close();
                player
                    .play({
                        path: filename,
                        sync: true
                    })
                    .then(() => {
                        queue.shift();
                        play(queue[0]);
                    });
            } else {
                synthesizer.close();
                console.error('Speech synthesis canceled, ' + result.errorDetails + '\nDid you update the subscription info?');
            }
        },
        function (err) {
            console.trace('err - ' + err);
            synthesizer.close();
        }
    );
};

const speak = (text, force = true) => {
    if (!force && queue.length > 10) {
        return;
    }
    if (queue.length === 0) {
        queue.push(text);
        PLAY && play(text);
    } else {
        queue.push(text);
    }
};

module.exports = speak;
