// @ts-ignore isolatedModules

const startupInterval = setInterval(() => {
    if (hasLoaded()) {
        clearInterval(startupInterval);
        main();
        applyOnPeriodChange();
        applyOnOpenStateChange();
    }
}, 50);

function main() {
    if (!isPeriodOpen()) {
        return;
    }

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
                    main();
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
                main();
            }, 1000);
        });
    });
}

function sleep(ms: number = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPeriodOpen() {
    return document.querySelector("#lockButton")?.innerHTML.includes("Öppen");
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
            saveButton.addEventListener("click", () => {
                // save will undo all changes, so redo them after the save.
                const saveInterval = setInterval(() => {
                    if (hasBeenSaved()) {
                        main();
                        clearInterval(saveInterval);
                    }
                }, 750);
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
