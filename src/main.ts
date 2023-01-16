// @ts-ignore isolatedModules

import { commentHandler } from "./features/comment";
import { fillWeekHandler } from "./features/fillWeek";
import { hasLoaded } from "./utils/baseUtils";

const startupInterval = setInterval(() => {
    if (hasLoaded()) {
        clearInterval(startupInterval);
        commentHandler();
        fillWeekHandler();
    }
}, 50);
