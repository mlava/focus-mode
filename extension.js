export default {
    onload: ({ extensionAPI }) => {
        var focusModeState = false;
        let hashChange = undefined;
        var fmTitle, fmBreadcrumbs, fmTopbar, fmLeftSidebar, fmRightSidebar, fmSearch, fmRefs, fmFullscreen;

        const config = {
            tabTitle: "Focus Mode Extended",
            settings: [
                {
                    id: "fm-title",
                    name: "Hide Page Title",
                    description: "Hide the Page Title",
                    action: { type: "switch", onChange: (evt) => { fmTitle = evt.target.checked; if (focusModeState) { focusModeOn(); } } },
                },
                {
                    id: "fm-breadcrumbs",
                    name: "Hide breadcrumb navigation",
                    description: "Hide breadcrumb navigation",
                    action: { type: "switch", onChange: (evt) => { fmBreadcrumbs = evt.target.checked; if (focusModeState) { focusModeOn(); } } },
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

        extensionAPI.ui.commandPalette.addCommand({
            label: "Toggle Focus Mode",
            callback: () => focusModeToggle()
        });

        hashChange = async (e) => {
            monitorPage();
        };
        window.addEventListener('hashchange', hashChange);

        if (extensionAPI.settings.get("fm-title") == true) { //onload set Settings values
            fmTitle = true;
        } else {
            fmTitle = false;
        }
        if (extensionAPI.settings.get("fm-breadcrumbs") == true) {
            fmBreadcrumbs = true;
        } else {
            fmBreadcrumbs = false;
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

        async function focusModeToggle() {
            if (focusModeState == false) {
                focusModeOn();
            } else {
                focusModeOff();
            }
        }

        async function monitorPage() {
            var fmRefs = true;
            if (extensionAPI.settings.get("fm-refs") == false) {
                fmRefs = false;
            }
            var referencesDiv = document.querySelector(".rm-reference-main");
            if (fmRefs == false) {
                await sleep(200);
                referencesDiv.classList.add('fm-norefs');
            } else if (fmRefs == true && referencesDiv != null && referencesDiv.hasOwnProperty("classList")) {
                await sleep(200);
                referencesDiv.classList.remove('fm-norefs');
            }
        }

        async function focusModeOn() {
            var titleDiv = document.querySelector(".rm-title-display");
            if (titleDiv) {
                if (fmTitle == true) {
                    titleDiv.classList.add('fm-hideTitle');
                } else {
                    titleDiv.classList.remove('fm-hideTitle');
                }
            }
            var breadcrumbsDiv = document.querySelector(".zoom-path-view");
            if (breadcrumbsDiv) {
                if (fmBreadcrumbs == true) {
                    breadcrumbsDiv.classList.add('fm-hideBreadcrumbs');
                } else {
                    breadcrumbsDiv.classList.remove('fm-hideBreadcrumbs');
                }
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
 
            var appBG;
            var cssString;
            if (fmFullscreen == true) {
                const app = document.querySelector(".roam-body .roam-app");
                const compApp = window.getComputedStyle(app);
                if (compApp["backgroundColor"] == "rgba(0, 0, 0, 0)") {
                    appBG = "white";
                    cssString = ".roam-body .roam-app {background-color: " + appBG + " !important;} ";
                } else {
                    var R, G, B, A;
                    var colours = compApp["backgroundColor"].split("(")[1];
                    colours = colours.split(",");
                    R = colours[0].trim();
                    G = colours[1].trim();
                    B = colours[2].trim();
                    B = B.split(")")[0];
                    if (colours.length == 3) {
                        A = 0;
                    } else {
                        A = colours[4];
                    }

                    const brightness = R * 0.299 + G * 0.587 + B * 0.114 + ((1 - A) * 255);
                    appBG = RGBAToHexA(compApp["backgroundColor"], true);
                    cssString = ".roam-body .roam-app {background-color: " + appBG + " !important; } ";
                }
                var head = document.getElementsByTagName("head")[0]; // remove any existing toc styles and add updated styles
                if (document.getElementById("fm-css")) {
                    var cssStyles = document.getElementById("fm-css");
                    head.removeChild(cssStyles);
                }
                var style = document.createElement("style");
                style.id = "fm-css";
                style.textContent = cssString;
                head.appendChild(style);

                var elem = document.querySelector(".roam-body");
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
            var titleDiv = document.querySelector(".rm-title-display");
            var breadcrumbsDiv = document.querySelector(".zoom-path-view");
            if (titleDiv) {
                titleDiv.classList.remove('fm-hideTitle');
            }
            if (breadcrumbsDiv) {
                breadcrumbsDiv.classList.remove('fm-hideBreadcrumbs');
            }
            document.querySelector("#app > div > div > div.flex-h-box > div.roam-main > div.rm-files-dropzone > div").style.visibility = "visible";
            document.querySelector("div.rm-reference-main").style.visibility = "visible";
            document.querySelector(".roam-body .roam-app .roam-sidebar-container .roam-sidebar-content").style.visibility = "visible";
            document.querySelector(".roam-body .roam-app .roam-sidebar-container").style.visibility = "visible";

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
            var head = document.getElementsByTagName("head")[0]; // remove any existing toc styles and add updated styles
            if (document.getElementById("fm-css")) {
                var cssStyles = document.getElementById("fm-css");
                head.removeChild(cssStyles);
            }
            focusModeState = false;
        }
    },
    onunload: () => {
        focusModeOff();
        window.removeEventListener('hashchange', hashChange);
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function RGBAToHexA(rgba, forceRemoveAlpha) { // courtesy of Lars Flieger at https://stackoverflow.com/questions/49974145/how-to-convert-rgba-to-hex-color-code-using-javascript
    return "#" + rgba.replace(/^rgba?\(|\s+|\)$/g, '') // Gets rgba / rgb string values
        .split(',') // splits them at ","
        .filter((string, index) => !forceRemoveAlpha || index !== 3)
        .map(string => parseFloat(string)) // Converts them to numbers
        .map((number, index) => index === 3 ? Math.round(number * 255) : number) // Converts alpha to 255 number
        .map(number => number.toString(16)) // Converts numbers to hex
        .map(string => string.length === 1 ? "0" + string : string) // Adds 0 when length of one number is 1
        .join("") // Puts the array to together to a string
}