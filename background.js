var url_mappings = {};
browser.storage.sync.get("mappings").then((result) => {
    if (result["mappings"] != null) {
        url_mappings = result["mappings"];
    }
}, (error) => { console.log(error) });

browser.omnibox.onInputChanged.addListener((input, suggest) => {
    var parts = input.split(" ");
    // need exactly two args: project key and issue number
    if (parts.length != 2 || parts[1].length == 0) {
        return [];
    }

    var cmd = parts[0];
    var issue = parts[1];
    var url;
    var result = [];

    for (const id in url_mappings) {
        if (url_mappings[id].cmd == cmd) {
            url = url_mappings[id].url;
            url += cmd + "-" + issue;
            var suggestion = {
                "content": url,
                "description": "Open JIRA: " + url
            }
            result.push(suggestion);
            break;
        }
    }
    suggest(result);
});

browser.omnibox.onInputEntered.addListener((url, disposition) => {
    switch (disposition) {
        case "currentTab":
            browser.tabs.update({ url });
            break;
        case "newForegroundTab":
            browser.tabs.create({ url });
            break;
        case "newBackgroundTab":
            browser.tabs.create({ url, active: false });
            break;
    }
});