// @ts-ignore isolatedModules

export function hasLoaded() {
    return document.querySelector(".commentIcon") !== null;
}

export function sleep(ms: number = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isPeriodOpen() {
    return document.querySelector("#lockButton")?.innerHTML.includes("Öppen");
}

export function waitForSave(interval: number = 750) {
    return new Promise<void>((resolve) => {
        const saveInterval = setInterval(() => {
            if (hasBeenSaved()) {
                resolve();
                clearInterval(saveInterval);
            }
        }, interval);
    });
}

function hasBeenSaved() {
    return (
        document.querySelector(".saveStatus")?.innerHTML ===
        "Alla ändringar sparade"
    );
}
