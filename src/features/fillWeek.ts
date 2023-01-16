// @ts-ignore isolatedModules

export function fillWeekHandler() {
    const currentButtons = getAllHamsterTime();

    for (const button of currentButtons) {
        const container = button.parentElement;
        if (!container) return;

        container.style.display = "flex";
        container.style.gap = "5px";

        const newButton = createButton("", "fa-calendar-check-o");
        container.appendChild(newButton);
    }
}

function getAllHamsterTime() {
    return Array.from(document.querySelectorAll("button.btn.hamstertime"));
}

function createButton(title: string, faIcon: string) {
    const div = document.createElement("button");
    div.innerHTML = `<button class="btn"><i class="fa ${faIcon}"></i> ${title}</button>`;

    return div.firstElementChild as HTMLElement;
}
