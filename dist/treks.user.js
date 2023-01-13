// ==UserScript==
// @name       treks
// @namespace  treks
// @version    0.0.2
// @author     Anton
// @match      https://*.treks.se/time
// ==/UserScript==

(function() {
  "use strict";
  const startupInterval = setInterval(() => {
    if (hasLoaded()) {
      clearInterval(startupInterval);
      main();
    }
  }, 50);
  function main() {
    const comments = getAllComments();
    for (const comment of comments) {
      const hasContent = commentHasContent(comment);
      modifyIcon(comment, hasContent);
      addEventListeners(comment);
    }
  }
  function sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function addEventListeners(comment) {
    comment.addEventListener("click", async () => {
      var _a, _b;
      const inputField = (_b = (_a = comment.parentElement) == null ? void 0 : _a.previousElementSibling) == null ? void 0 : _b.querySelector(
        "input"
      );
      const shiftNEvent = new KeyboardEvent("keydown", {
        key: "N",
        shiftKey: true,
        bubbles: true
      });
      if (inputField instanceof HTMLInputElement) {
        inputField.dispatchEvent(shiftNEvent);
      }
      await sleep();
      const saveButton = document.querySelector("#notesave");
      if (saveButton instanceof HTMLButtonElement) {
        saveButton.addEventListener("click", () => {
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
    var _a;
    return ((_a = document.querySelector(".saveStatus")) == null ? void 0 : _a.innerHTML) === "Alla ändringar sparade";
  }
  function modifyIcon(comment, commentHasContent2) {
    if (!commentHasContent2) {
      comment.classList.add("fa");
      comment.classList.add("fa-comment-o");
    }
    comment.style.cursor = "pointer";
  }
  function commentHasContent(comment) {
    return comment.dataset.originalTitle !== "";
  }
  function getAllComments() {
    return Array.from(document.querySelectorAll(".commentIcon")).map((e) => e.firstElementChild).filter((e) => e !== null);
  }
  function hasLoaded() {
    return document.querySelector(".commentIcon") !== null;
  }
})();
