// @ts-ignore isolatedModules

export function fillWeekHandler() {
    const currentButton = document.querySelector(".show-shortcuts");
    if (!currentButton) return;

    const container = currentButton.parentElement;
    if (!container) return;

    const button = createButton("Fyll vecka", "fa-calendar-check-o");
    container.appendChild(button);
}

function createButton(title: string, faIcon: string) {
    const div = document.createElement("button");
    div.innerHTML = `<button class="btn"><i class="fa ${faIcon}"></i> ${title}</button>`;

    return div.firstElementChild as HTMLElement;
}
