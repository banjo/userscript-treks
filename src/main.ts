// @ts-ignore isolatedModules

import { commentHandler } from "./features/comment";

const startupInterval = setInterval(() => {
    if (hasLoaded()) {
        clearInterval(startupInterval);
        commentHandler();
    }
}, 50);

function hasLoaded() {
    return document.querySelector(".commentIcon") !== null;
}
