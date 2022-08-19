const config = {
    tabTitle: "Focus Mode",
    settings: [
        {
            id: "fm-title",
            name: "Hide Page Title",
            description: "Hide the Page Title",
            action: { type: "switch" },
        },
        {
            id: "fm-topbar",
            name: "Show Topbar",
            description: "Don't hide Topbar",
            action: { type: "switch" },
        },
        {
            id: "fm-leftSidebar",
            name: "Show Left Sidebar",
            description: "Don't hide Left Sidebar",
            action: { type: "switch" },
        },
        {
            id: "fm-rightSidebar",
            name: "Show Right Sidebar",
            description: "Don't hide Right Sidebar",
            action: { type: "switch" },
        },
        {
            id: "fm-refs",
            name: "Show Linked and Unlinked References",
            description: "Don't hide References",
            action: { type: "switch" },
        },
    ]
};

var focusModeState;
export default {
    onload: ({ extensionAPI }) => {
        extensionAPI.settings.panel.create(config);
        window.roamAlphaAPI.ui.commandPalette.addCommand({
            label: "Toggle Focus Mode",
            callback: () => focusModeToggle({ extensionAPI })
        });
        focusModeState = false;
    },
    onunload: () => {
        window.roamAlphaAPI.ui.commandPalette.removeCommand({
            label: 'Toggle Focus Mode'
        });
        focusModeOff();
    }
}

function focusModeToggle({ extensionAPI }) {
    if (focusModeState == false) {
        focusModeOn({ extensionAPI });
    } else {
        focusModeOff();
    }
}

async function focusModeOn({ extensionAPI }) {
    var fmTitle, fmTopbar, fmLeftSidebar, fmRightSidebar, fmRefs;
    if (extensionAPI.settings.get("fm-title") == true) {
        fmTitle = true;
    } else {
        fmTitle = false;
    }
    if (extensionAPI.settings.get("fm-topbar") == true) {
        fmTopbar = true;
    } else {
        fmTopbar = false;
    }
    if (extensionAPI.settings.get("fm-leftSidebar") == true) {
        fmLeftSidebar = true;
    } else {
        fmLeftSidebar = false;
    }
    if (extensionAPI.settings.get("fm-rightSidebar") == true) {
        fmRightSidebar = true;
    } else {
        fmRightSidebar = false;
    }
    if (extensionAPI.settings.get("fm-refs") == true) {
        fmRefs = true;
    } else {
        fmRefs = false;
    }
    if (fmTitle == true) {
        document.querySelector(".rm-title-display").style.visibility = "hidden";
    }
    if (fmTopbar == false) {
        document.querySelector("#app > div > div > div.flex-h-box > div.roam-main > div.rm-files-dropzone > div").style.visibility = "hidden";
    }
    if (fmLeftSidebar == false) {
        await roamAlphaAPI.ui.leftSidebar.close();
    }
    if (fmRightSidebar == false) {
        await roamAlphaAPI.ui.rightSidebar.close();
    }
    if (fmRefs == false) {
        document.querySelector("div.rm-reference-main").style.visibility = "hidden";
    }
    var matches = document.querySelectorAll("div.roam-log-page");
    for (var i = 1; i < matches.length; i++) {
        matches[i].style.visibility = "hidden";
    }
    focusModeState = true;
}

async function focusModeOff() {
    document.querySelector("#app > div > div > div.flex-h-box > div.roam-main > div.rm-files-dropzone > div").style.visibility = "visible";
    document.querySelector("div.rm-reference-main").style.visibility = "visible";
    document.querySelector(".roam-body .roam-app .roam-sidebar-container .roam-sidebar-content").style.visibility = "visible";
    document.querySelector(".roam-body .roam-app .roam-sidebar-container").style.visibility = "visible";
    document.querySelector(".rm-title-display").style.visibility = "visible";
    var matches = document.querySelectorAll("div.roam-log-page");
    for (var i = 1; i < matches.length; i++) {
        matches[i].style.visibility = "visible";
    }
    await roamAlphaAPI.ui.leftSidebar.open();
    focusModeState = false;
}