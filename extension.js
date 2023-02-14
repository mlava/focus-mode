var focusModeState = false;
let myEventHandler = undefined;
let hashChange = undefined;
var fmTitle, fmTopbar, fmLeftSidebar, fmRightSidebar, fmSearch, fmRefs, fmFullscreen;

export default {
    onload: ({ extensionAPI }) => {
        const config = {
            tabTitle: "Focus Mode",
            settings: [
                {
                    id: "fm-title",
                    name: "Hide Page Title",
                    description: "Hide the Page Title",
                    action: { type: "switch", onChange: (evt) => { fmTitle = evt.target.checked; if (focusModeState) { focusModeOn(); } } },
                },
                {
                    id: "fm-topbar",
                    name: "Show Topbar",
                    description: "Don't hide Topbar",
                    action: { type: "switch", onChange: (evt) => { fmTopbar = evt.target.checked; if (focusModeState) { focusModeOn(); } } },
                },
                {
                    id: "fm-leftSidebar",
                    name: "Show Left Sidebar",
                    description: "Don't hide Left Sidebar",
                    action: { type: "switch", onChange: (evt) => { fmLeftSidebar = evt.target.checked; if (focusModeState) { focusModeOn(); } } },
                },
                {
                    id: "fm-rightSidebar",
                    name: "Show Right Sidebar",
                    description: "Don't hide Right Sidebar",
                    action: { type: "switch", onChange: (evt) => { fmRightSidebar = evt.target.checked; if (focusModeState) { focusModeOn(); } } },
                },
                {
                    id: "fm-refs",
                    name: "Show Linked and Unlinked References",
                    description: "Don't hide References",
                    action: { type: "switch", onChange: (evt) => { fmRefs = evt.target.checked; if (focusModeState) { focusModeOn(); } } },
                },
                {
                    id: "fm-search",
                    name: "Keep search intact",
                    description: "Don't hide the search box (and maintain access to CTRL-u search shortcut)",
                    action: { type: "switch", onChange: (evt) => { fmSearch = evt.target.checked; if (focusModeState) { focusModeOn(); } } },
                },
                {
                    id: "fm-fullscreen",
                    name: "Go to full screen in focus mode",
                    description: "Turn on to use full screen while in focus mode",
                    action: { type: "switch", onChange: (evt) => { fmFullscreen = evt.target.checked; if (focusModeState) { focusModeOn(); } } },
                },
            ]
        };
        extensionAPI.settings.panel.create(config);

        window.roamAlphaAPI.ui.commandPalette.addCommand({
            label: "Toggle Focus Mode",
            callback: () => focusModeToggle({ extensionAPI })
        });
        focusModeState = false; //onload

        hashChange = async (e) => {
            monitorPage({ extensionAPI });
        };
        window.addEventListener('hashchange', hashChange);

        myEventHandler = function (e) {
            if (e.key.toLowerCase() === 'f' && e.shiftKey && e.altKey) {
                focusModeToggle({ extensionAPI });
            }
        }
        window.addEventListener('keydown', myEventHandler, false);

        if (extensionAPI.settings.get("fm-title") == true) { //onload set Settings values
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
        if (extensionAPI.settings.get("fm-fullscreen") == true) {
            fmFullscreen = true;
        } else {
            fmFullscreen = false;
        }
    },
    onunload: () => {
        window.roamAlphaAPI.ui.commandPalette.removeCommand({
            label: 'Toggle Focus Mode'
        });
        focusModeOff();
        window.removeEventListener('hashchange', hashChange);
        window.removeEventListener('keydown', myEventHandler, false);
    }
}

function focusModeToggle({ extensionAPI }) {
    if (focusModeState == false) {
        focusModeOn({ extensionAPI });
    } else {
        focusModeOff();
    }
}

async function monitorPage({ extensionAPI }) {
    var fmRefs = true;
    if (extensionAPI.settings.get("fm-refs") == false) {
        fmRefs = false;
    }
    var referencesDiv = document.querySelector(".rm-reference-main");
    if (fmRefs == false) {
        await sleep(200);
        referencesDiv.classList.add('fm-norefs');
    } else if (fmRefs == true && referencesDiv.hasOwnProperty("classList")) {
        if (referencesDiv.classList.contains("fm-norefs")) {
            await sleep(200);
            referencesDiv.classList.remove('fm-norefs');
        }
    }
}

async function focusModeOn() {
    if (fmTitle == true) {
        document.querySelector(".rm-title-display").style.visibility = "hidden";
    } else {
        document.querySelector(".rm-title-display").style.visibility = "visible";
    }

    if (fmLeftSidebar == false) {
        await roamAlphaAPI.ui.leftSidebar.close();
    } else {
        await roamAlphaAPI.ui.leftSidebar.open();
    }
    if (fmRightSidebar == false) {
        await roamAlphaAPI.ui.rightSidebar.close();
    } else {
        await roamAlphaAPI.ui.rightSidebar.open();
    }
    var matches = document.querySelectorAll("div.roam-log-page");
    for (var i = 1; i < matches.length; i++) {
        matches[i].style.visibility = "hidden";
    }

    var topBarDiv = document.querySelector(".rm-topbar");
    var searchDiv = document.querySelector(".rm-find-or-create-wrapper");
    var referencesDiv = document.querySelector(".rm-reference-main");
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
    } else {
        topBarDiv.classList.remove('fm-nosearch');
        topBarDiv.classList.remove('fm-search');
        searchDiv.classList.remove('fm-losesearch');
        searchDiv.classList.remove('fm-keepsearch');
    }
    if (fmRefs == false) {
        referencesDiv.classList.add('fm-norefs');
    } else {
        referencesDiv.classList.remove('fm-norefs');
    }
    if (fmFullscreen == true) {
        var elem = document.querySelector(".roam-article");
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
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
    var referencesDiv = document.querySelector(".rm-reference-main");
    await sleep(200);
    topBarDiv.classList.remove('fm-nosearch');
    topBarDiv.classList.remove('fm-search');
    searchDiv.classList.remove('fm-losesearch');
    searchDiv.classList.remove('fm-keepsearch');
    referencesDiv.classList.remove('fm-norefs');

    if (document.fullscreenElement != null) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
    focusModeState = false;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}