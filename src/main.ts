// @ts-ignore isolatedModules

const startupInterval = setInterval(() => {
    if (hasLoaded()) {
        clearInterval(startupInterval);
        handler();
        applyOnPeriodChange();
        applyOnOpenStateChange();
    }
}, 50);

function handler() {
    if (!isPeriodOpen()) {
        return;
    }

    applyOnInputFieldChange();

    const comments = getAllComments();

    for (const comment of comments) {
        const hasContent = commentHasContent(comment);
        modifyIcon(comment, hasContent);
        addEventListeners(comment);
    }
}

function applyOnOpenStateChange() {
    const openStateButton = document.querySelector("#lockButton");
    if (openStateButton instanceof HTMLButtonElement) {
        openStateButton.addEventListener("click", () => {
            if (!isPeriodOpen()) {
                setTimeout(() => {
                    handler();
                }, 1000);
            }
        });
    }
}

function applyOnPeriodChange() {
    const periodButtons = Array.from(document.querySelectorAll(".btn-period"));
    periodButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setTimeout(() => {
                handler();
            }, 1000);
        });
    });
}

function applyOnInputFieldChange() {
    const inputField = Array.from(document.querySelectorAll("input.time"));

    inputField.forEach((input) => {
        if (input instanceof HTMLInputElement) {
            input.addEventListener("keyup", async () => {
                await waitForSave();
                handler();
            });
        }
    });
}

function sleep(ms: number = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPeriodOpen() {
    return document.querySelector("#lockButton")?.innerHTML.includes("Öppen");
}

function waitForSave(interval: number = 750) {
    return new Promise<void>((resolve) => {
        const saveInterval = setInterval(() => {
            if (hasBeenSaved()) {
                resolve();
                clearInterval(saveInterval);
            }
        }, interval);
    });
}

function addEventListeners(comment: HTMLElement) {
    comment.addEventListener("click", async () => {
        const inputField =
            comment.parentElement?.previousElementSibling?.querySelector(
                "input"
            );

        const shiftNEvent = new KeyboardEvent("keydown", {
            key: "N",
            shiftKey: true,
            bubbles: true,
        });

        if (inputField instanceof HTMLInputElement) {
            inputField.dispatchEvent(shiftNEvent);
        }

        await sleep();

        const saveButton = document.querySelector("#notesave");

        if (saveButton instanceof HTMLButtonElement) {
            saveButton.addEventListener("click", async () => {
                // save will undo all changes, so redo them after the save.
                await waitForSave();
                handler();
            });
        }
    });
}

function hasBeenSaved() {
    return (
        document.querySelector(".saveStatus")?.innerHTML ===
        "Alla ändringar sparade"
    );
}

function modifyIcon(comment: HTMLElement, commentHasContent: boolean) {
    if (!commentHasContent) {
        comment.classList.add("fa");
        comment.classList.add("fa-comment-o");
    }

    comment.style.cursor = "pointer";
}

function commentHasContent(comment: HTMLElement) {
    return comment.dataset.originalTitle !== "";
}

function getAllComments(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>(".commentIcon"))
        .map((e) => e.firstElementChild)
        .filter((e) => e !== null) as HTMLElement[];
}

function hasLoaded() {
    return document.querySelector(".commentIcon") !== null;
}
