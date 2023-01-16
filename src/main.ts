// @ts-ignore isolatedModules

import { commentHandler } from "./features/comment";
import { hasLoaded } from "./utils/baseUtils";

const startupInterval = setInterval(() => {
    if (hasLoaded()) {
        clearInterval(startupInterval);
        commentHandler();
    }
}, 50);
