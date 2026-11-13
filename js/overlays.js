// This file is for overlay universal functions
// It needs state.js loaded before it
let updateInterval = 2000;

// Adds an element per overlay.json key, set as text so values can't inject markup
function outputJSON(key, data) {
    const element = document.createElement('h1');
    element.id = key;
    element.textContent = data;

    return document.getElementById('body').appendChild(element);
}

const documentReady = new Promise((resolve) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
    } else {
        resolve();
    }
});

// Keeps trying until the server answers, so a page opened before the server starts still loads
function fetchState() {
    return fetch('../json/overlay.json', { cache: 'no-store' })
        .then((response) => response.json())
        .catch(() => new Promise((resolve) => setTimeout(resolve, updateInterval)).then(fetchState));
}

// Settles once every overlay.json key has an element on the page
const overlayReady = Promise.all([fetchState(), documentReady]).then(([jsonData]) => {
    for (const key in jsonData) {
        outputJSON(key, jsonData[key]);
    }
});

// Calls `callback` with the overlay state now and after every change
function onOverlayState(callback) {
    overlayReady.then(() => subscribeOverlayState(callback, updateInterval));
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) element.textContent = value;
}

// Runs `apply(element, won)` for each of a side's round markers, `${side}RoundsWon1` and up
function setRounds(side, count, wins, apply) {
    for (let i = 1; i <= count; i++) {
        const element = document.getElementById(`${side}RoundsWon${i}`);

        if (element) apply(element, wins >= i);
    }
}
