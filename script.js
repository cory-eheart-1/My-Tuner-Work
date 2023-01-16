"use strict"

var connected = false;
var note = document.getElementById("note");
var freq = document.getElementById("freq");
var context, source, analyser, frequencies, lastNote = 0;

function init() {
    if (navigator.mediaDevices) {
        navigator.mediaDevices
        .getUserMedia({audio: true, video: false})
        .then( tune );
    }
}

window.setTimeout(init, 200);

function tune( stream ) {
    context = new (window.AudioContext || window.webkitAudioContext );
    source = context.createMediaStreamSource(stream);
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.9;
    source.connect(analyser);
    frequencies = new Float32Array(analyser.frequencyBinCount);

    getPitch();
}

function getPitch() {
    var timeDomain = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeDomain);

    var pitch = WAD.autoCorrelate(timeDomain, context.sampleRate);
    var noteName = WAD.noteFromPitch( pitch ) || lastNote;

    // var len = frequencies.length;
    analyser.getFloatFrequencyData(frequencies);

    if (noteName != lastNote) {
        note.innerHTML = noteName;
        freq.innerHTML = pitch + " Hz";
    }
    lastNote = noteName;
}