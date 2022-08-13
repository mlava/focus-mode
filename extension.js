export default {
    onload: ({ }) => {
        window.roamAlphaAPI.ui.commandPalette.addCommand({
            label: "Focus Mode On",
            callback: () => focusModeOn()
        });
        window.roamAlphaAPI.ui.commandPalette.addCommand({
            label: "Focus Mode Off",
            callback: () => focusModeOff()
        });

        async function focusModeOn() {
            await roamAlphaAPI.ui.rightSidebar.close();
            document.querySelector("#app > div > div > div.flex-h-box > div.roam-main > div.rm-files-dropzone > div").style.visibility = "hidden";
            document.querySelector("div.rm-reference-main").style.visibility = "hidden";
            document.querySelector(".roam-body .roam-app .roam-sidebar-container .roam-sidebar-content").style.visibility = "hidden";
            document.querySelector(".roam-body .roam-app .roam-sidebar-container").style.visibility = "hidden";
            var matches = document.querySelectorAll("div.roam-log-page");
            for (var i =1; i < matches.length; i++) {
                matches[i].style.visibility = "hidden";
            }
        }

        async function focusModeOff() {
            document.querySelector("#app > div > div > div.flex-h-box > div.roam-main > div.rm-files-dropzone > div").style.visibility = "visible";
            document.querySelector("div.rm-reference-main").style.visibility = "visible";
            document.querySelector(".roam-body .roam-app .roam-sidebar-container .roam-sidebar-content").style.visibility = "visible";
            document.querySelector(".roam-body .roam-app .roam-sidebar-container").style.visibility = "visible";
            var matches = document.querySelectorAll("div.roam-log-page");
            for (var i =1; i < matches.length; i++) {
                matches[i].style.visibility = "visible";
            }
        }
    },
    onunload: () => {
        window.roamAlphaAPI.ui.commandPalette.removeCommand({
            label: 'Focus Mode On'
        });
        window.roamAlphaAPI.ui.commandPalette.removeCommand({
            label: 'Focus Mode Off'
        });
    }
}