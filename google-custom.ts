import "./google-custom-style.css";

const channel = new BroadcastChannel("google");
const ENGINGE_IDS = ["b2c8e585118724176", "83f35701b6a984777", "d27d3a215df6b46ae"];

function getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

setTimeout(() => {
    const searchInput = document.getElementById("gsc-i-id1") as HTMLInputElement;
    const searchButton = document.querySelector("button.gsc-search-button") as HTMLButtonElement;

    const scriptElement = document.createElement("script");

    scriptElement.src = `https://cse.google.com/cse.js?cx=${ENGINGE_IDS[getRandom(0, 3)]}`;
    scriptElement.async = true;

    document.body.appendChild(scriptElement);
    
    channel.onmessage = msg => {
        searchInput.value = msg.data as string;
        searchButton.click();
    };
}, 1000);