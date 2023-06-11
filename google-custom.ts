import "./google-custom-style.css";

const channel = new BroadcastChannel("google");

setTimeout(() => {
    const searchInput = document.getElementById("gsc-i-id1") as HTMLInputElement;
    const searchButton = document.querySelector("button.gsc-search-button") as HTMLButtonElement;

    channel.onmessage = msg => {
        searchInput.value = msg.data as string;
        searchButton.click();
    };
    
}, 1000);