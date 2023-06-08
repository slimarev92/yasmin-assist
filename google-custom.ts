import "./google-custom-style.css";

const channel = new BroadcastChannel("google");

setTimeout(() => {
    const searchInput = document.getElementById("gsc-i-id1") as HTMLInputElement;
    const searchButton = document.querySelector("button.gsc-search-button") as HTMLButtonElement;

    searchButton.style.display = "none";

    channel.onmessage = msg => {
        searchInput.value = msg.data as string;
        searchButton.click();
    };
    
}, 300);