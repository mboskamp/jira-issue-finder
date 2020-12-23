var url_mappings = {};
document.addEventListener("DOMContentLoaded", () => {
    browser.storage.sync.get("mappings").then((result) => {
        if (result["mappings"] != null) {
            url_mappings = result["mappings"];
        }
        for (const id in url_mappings) {
            addMapping(id, url_mappings[id].url, url_mappings[id].cmd);
        }
    }, (error) => { console.log(error) })
});

document.getElementById("add_mapping").addEventListener("click", (event) => { addMapping(); });
document.getElementById("clear_mappings").addEventListener("click", clearMappings);

function addMapping(id_param, url_param, cmd_param) {
    var id = id_param == null ? Math.floor(Math.random() * Math.floor(999999)) : id_param;

    var p_element = document.createElement("p");
    p_element.setAttribute("id", "mapping" + id);

    // url input
    var url_input_label_element = document.createElement("label");
    url_input_label_element.setAttribute("for", "url");
    url_input_label_element.innerHTML = "JIRA Base URL";
    p_element.appendChild(url_input_label_element);

    var url_input_element = document.createElement("input");
    url_input_element.setAttribute("name", "url");
    url_input_element.setAttribute("type", "text");
    url_input_element.setAttribute("value", url_param == null ? "http://www.example.com/" : url_param);
    url_input_element.setAttribute("id", "url" + id);
    url_input_element.addEventListener("keyup", () => {
        updateMapping(id, url_input_element, cmd_input_element);
    });
    p_element.appendChild(url_input_element);

    // command input
    var cmd_input_label_element = document.createElement("label");
    cmd_input_label_element.setAttribute("for", "cmd");
    cmd_input_label_element.innerHTML = "JIRA Project Key";
    p_element.appendChild(cmd_input_label_element);

    var cmd_input_element = document.createElement("input");
    cmd_input_element.setAttribute("name", "cmd");
    cmd_input_element.setAttribute("type", "text");
    cmd_input_element.setAttribute("value", cmd_param == null ? "cmd" : cmd_param);
    cmd_input_element.setAttribute("id", "cmd" + id);
    cmd_input_element.addEventListener("keyup", () => {
        updateMapping(id, url_input_element, cmd_input_element);
    });
    p_element.appendChild(cmd_input_element);

    // remove button
    var remove_button = document.createElement("input");
    remove_button.setAttribute("type", "button");
    remove_button.setAttribute("value", "Remove");
    remove_button.addEventListener("click", () => {
        p_element.remove();
        delete url_mappings[id];
    });
    p_element.appendChild(remove_button);

    var form_element = document.getElementById("mappings_form");
    form_element.insertBefore(p_element, form_element.firstChild);

    // save into url_mappings
    var mapping = {
        "url": url_input_element.getAttribute("value"),
        "cmd": cmd_input_element.getAttribute("value")
    }
    url_mappings[id] = mapping;
}

function updateMapping(id, url, cmd) {
    url_mappings[id].url = url.value;
    url_mappings[id].cmd = cmd.value;

    save();
}

function save() {
    browser.storage.sync.set({
        "mappings": url_mappings
    });
}

function clearMappings() {
    browser.storage.sync.remove("mappings");
    document.getElementById("mappings_form").innerHTML = "";
}