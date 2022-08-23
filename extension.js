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
        {
            id: "fm-search",
            name: "Keep search intact",
            description: "Don't hide the search box (and maintain access to CTRL-u search shortcut)",
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

        document.addEventListener('keydown', keyboardToggle());

        function keyboardToggle(e) {
            if (e.key.toLowerCase() === 'f' && e.shiftKey && e.altKey) {
                focusModeToggle({ extensionAPI });
            }
        }
    },
    onunload: () => {
        window.roamAlphaAPI.ui.commandPalette.removeCommand({
            label: 'Toggle Focus Mode'
        });
        focusModeOff();

        document.removeEventListener('keydown', keyboardToggle());
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
    var fmTitle, fmTopbar, fmLeftSidebar, fmRightSidebar, fmRefs, fmSearch;
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
    if (extensionAPI.settings.get("fm-search") == true) {
        fmSearch = true;
    } else {
        fmSearch = false;
    }
    if (fmTitle == true) {
        document.querySelector(".rm-title-display").style.visibility = "hidden";
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

    var topBarDiv = document.querySelector(".rm-topbar");
    var searchDiv = document.querySelector(".rm-find-or-create-wrapper");
    await sleep(200);

    if (fmTopbar == false) {
        if (fmSearch == true) {
            searchDiv.classList.add('fm-keepsearch');
            topBarDiv.classList.add('fm-search');
            searchDiv.classList.remove('fm-losesearch');
            topBarDiv.classList.remove('fm-nosearch');
        } else {
            searchDiv.classList.add('fm-losesearch');
            topBarDiv.classList.add('fm-nosearch');
            topBarDiv.classList.remove('fm-search');
            searchDiv.classList.remove('fm-keepsearch');
        }
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

    var topBarDiv = document.querySelector('.rm-topbar');
    var searchDiv = document.querySelector(".rm-find-or-create-wrapper");
    await sleep(200);
    topBarDiv.classList.remove('fm-nosearch');
    topBarDiv.classList.remove('fm-search');
    searchDiv.classList.remove('fm-losesearch');
    searchDiv.classList.remove('fm-keepsearch');
    focusModeState = false;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}