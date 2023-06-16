import "./google-custom-style.css";

const ENGINE_IDS = ["b2c8e585118724176", "83f35701b6a984777", "d27d3a215df6b46ae"];

function getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function initCommunication() {
    const channel = new BroadcastChannel("google");

    const searchInput = document.getElementById("gsc-i-id1") as HTMLInputElement;
    const searchButton = document.querySelector("button.gsc-search-button") as HTMLButtonElement;
    
    channel.onmessage = msg => {
        searchInput.value = msg.data as string;
        searchButton.click();
    };
}

const scriptElement = document.createElement("script");

scriptElement.src = `https://cse.google.com/cse.js?cx=${ENGINE_IDS[getRandom(0, 2)]}`;
scriptElement.async = true;

document.body.appendChild(scriptElement);

const observer = new MutationObserver(mutations => {
    if (mutations.some(m => Array.from(m.addedNodes).some(an => (an as HTMLElement).id === "___gcse_0"))) {
        initCommunication();

        observer.disconnect();
    }
});

observer.observe(document.body, { subtree: false, childList: true });