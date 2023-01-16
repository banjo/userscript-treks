// ==UserScript==
// @name       treks
// @namespace  treks
// @version    0.0.7
// @author     Anton
// @match      https://*.treks.se/time
// ==/UserScript==

(function() {
  "use strict";
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
          }, 1e3);
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
        }, 1e3);
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
  function sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function isPeriodOpen() {
    var _a;
    return (_a = document.querySelector("#lockButton")) == null ? void 0 : _a.innerHTML.includes("Öppen");
  }
  function waitForSave(interval = 750) {
    return new Promise((resolve) => {
      const saveInterval = setInterval(() => {
        if (hasBeenSaved()) {
          resolve();
          clearInterval(saveInterval);
        }
      }, interval);
    });
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
        saveButton.addEventListener("click", async () => {
          await waitForSave();
          handler();
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
