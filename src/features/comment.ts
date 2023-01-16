// @ts-ignore isolatedModules
import { featureService } from "./../features";
import { isPeriodOpen, sleep, waitForSave } from "../utils/baseUtils";

featureService.add({
    name: "comment",
    init: commentHandler,
    options: {
        states: ["open"],
    },
});

export function commentHandler() {
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
                commentHandler();
            });
        }
    });
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
