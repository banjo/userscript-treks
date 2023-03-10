// ==UserScript==
// @name       treks
// @namespace  treks
// @version    0.0.12
// @author     Anton
// @match      https://*.treks.se/time
// ==/UserScript==

(function() {
  "use strict";
  function hasLoaded() {
    return document.querySelector(".commentIcon") !== null;
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
  function hasBeenSaved() {
    var _a;
    return ((_a = document.querySelector(".saveStatus")) == null ? void 0 : _a.innerHTML) === "Alla ändringar sparade";
  }
  function initApplicator() {
    applyOnInputFieldChange();
    applyOnPeriodChange();
    applyOnStateChange();
  }
  function applyOnStateChange() {
    const openStateButton = document.querySelector("#lockButton");
    if (openStateButton instanceof HTMLButtonElement) {
      openStateButton.addEventListener("click", () => {
        setTimeout(() => {
          featureService.init();
        }, 1e3);
      });
    }
  }
  function applyOnPeriodChange() {
    const periodButtons = Array.from(document.querySelectorAll(".btn-period"));
    periodButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setTimeout(() => {
          featureService.init();
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
          featureService.init();
        });
      }
    });
  }
  function shouldInitBasedOnPeriodState(feature) {
    var _a;
    let shouldInit = false;
    if ((_a = feature.options) == null ? void 0 : _a.states) {
      if (isPeriodOpen() && feature.options.states.includes("open")) {
        shouldInit = true;
      } else if (!isPeriodOpen() && feature.options.states.includes("locked")) {
        shouldInit = true;
      }
    } else {
      shouldInit = true;
    }
    return shouldInit;
  }
  const features = [];
  const add = (feature) => features.push(feature);
  const get = () => features;
  const init = () => {
    features.forEach((f) => {
      if (shouldInitBasedOnPeriodState(f))
        f.init();
    });
    initApplicator();
  };
  const featureService = { add, get, init };
  featureService.add({
    name: "fillWeek",
    init: fillWeekHandler,
    options: {
      states: ["open"]
    }
  });
  function fillWeekHandler() {
    const alreadyCreated = checkIfAlreadyCreated();
    if (alreadyCreated)
      return;
    const currentButtons = getAllHamsterTime();
    for (const button of currentButtons) {
      const container = button.parentElement;
      if (!container)
        return;
      container.style.display = "flex";
      container.style.gap = "5px";
      const newButton = createButton("", "fa-calendar-check-o");
      container.appendChild(newButton);
      const projectId = button.getAttribute("data-projectid");
      const input = getFirstInputWithProjectId(projectId);
      if (!input)
        return;
      newButton.addEventListener("click", async () => {
        const keyboardEvent = new KeyboardEvent("keydown", {
          key: "F",
          shiftKey: true,
          bubbles: true
        });
        input.dispatchEvent(keyboardEvent);
        await waitForSave();
        setTimeout(featureService.init, 1e3);
      });
    }
  }
  function getFirstInputWithProjectId(projectId) {
    return document.querySelector(`input[data-projectid="${projectId}"]`);
  }
  function getAllHamsterTime() {
    return Array.from(document.querySelectorAll("button.btn.hamstertime"));
  }
  function checkIfAlreadyCreated() {
    return document.querySelector("button[data-user-generated='true']");
  }
  function createButton(title, faIcon) {
    const div = document.createElement("button");
    div.innerHTML = `<button class="btn" data-user-generated="true"><i class="fa ${faIcon}"></i> ${title}</button>`;
    return div.firstElementChild;
  }
  featureService.add({
    name: "comment",
    init: commentHandler,
    options: {
      states: ["open"]
    }
  });
  function commentHandler() {
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
          commentHandler();
        });
      }
    });
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
  const startupInterval = setInterval(() => {
    if (hasLoaded()) {
      clearInterval(startupInterval);
      featureService.init();
    }
  }, 50);
})();
