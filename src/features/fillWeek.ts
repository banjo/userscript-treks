import { featureService } from "./../features";
// @ts-ignore isolatedModules

featureService.add({
    name: "fillWeek",
    init: fillWeekHandler,
    options: {
        states: ["open"],
    },
});

function fillWeekHandler() {
    const alreadyCreated = checkIfAlreadyCreated();
    if (alreadyCreated) return;

    const currentButtons = getAllHamsterTime();

    for (const button of currentButtons) {
        const container = button.parentElement;
        if (!container) return;

        container.style.display = "flex";
        container.style.gap = "5px";

        const newButton = createButton("", "fa-calendar-check-o");
        container.appendChild(newButton);

        const projectId = button.getAttribute("data-projectid");

        const input = getFirstInputWithProjectId(projectId);
        if (!input) return;

        newButton.addEventListener("click", () => {
            const keyboardEvent = new KeyboardEvent("keydown", {
                key: "F",
                shiftKey: true,
                bubbles: true,
            });
            input.dispatchEvent(keyboardEvent);
        });
    }
}

function getFirstInputWithProjectId(projectId: string | null) {
    return document.querySelector(`input[data-projectid="${projectId}"]`);
}

function getAllHamsterTime() {
    return Array.from(document.querySelectorAll("button.btn.hamstertime"));
}

function checkIfAlreadyCreated() {
    return document.querySelector("button[data-user-generated='true']");
}

function createButton(title: string, faIcon: string): HTMLButtonElement {
    const div = document.createElement("button");
    div.innerHTML = `<button class="btn" data-user-generated="true"><i class="fa ${faIcon}"></i> ${title}</button>`;

    return div.firstElementChild as HTMLButtonElement;
}
