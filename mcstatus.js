function mcAddStylesheet() {
    var head = document.getElementsByTagName("head")[0];

    var style = document.createElement("link");
    style.setAttribute("href", "https://g.breq.dev/mcstatus/mcstatus.css");
    style.setAttribute("type", "text/css");
    style.setAttribute("rel", "stylesheet");

    head.appendChild(style);
}

mcAddStylesheet();

function mcStatus(parent, server) {
    const apiEndpoint = "https://mcstatus.breq.dev/status?server="

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            console.log(this.responseText);
            mcHandleStatus(parent, server, this.status, JSON.parse(this.responseText));
        }
    };

    xhr.open("GET", apiEndpoint + server, true);
    xhr.send();
}

function mcDescriptionToHTML(descriptionRaw) {
    const color_codes = {
        "dark_red": "#be0000",
        "red": "#fe3f3f",
        "gold": "#D9A334",
        "yellow": "#fefe3f",
        "dark_green": "#00be00",
        "green": "#3ffe3f",
        "aqua": "#3ffefe",
        "dark_aqua": "#00bebe",
        "dark_blue": "#0000be",
        "blue": "#3f3ffe",
        "light_purple": "#fe3ffe",
        "purple": "#be00be",

        "white": "#ffffff",
        "gray": "#bebebe",
        "dark_gray": "#3f3f3f",
        "black": "#000000",
    };

    var root = document.createElement("div");
    root.classList.add("mc-description");

    descriptionRaw.forEach(function(item, index) {
        var chunk = document.createElement("span");
        chunk.classList.add("mc-description-chunk");

        if (item["bold"]) {
            chunk.classList.add("mc-description-bold");
        }
        if (item["italic"]) {
            chunk.classList.add("mc-description-italic");
        }
        if (item["obfuscated"]) {
            chunk.classList.add("mc-description-obfuscated");
        }
        if (item["strikethrough"]) {
            chunk.classList.add("mc-description-strikethrough");
        }
        if (item["underlined"]) {
            chunk.classList.add("mc-description-underlined");
        }

        chunk.style.color = color_codes[item["color"]];

        var textNode = document.createTextNode(item["text"]);
        chunk.appendChild(textNode);

        root.appendChild(chunk);
    });

    return root;
}

function mcPlayersToHTML(playersRaw) {
    var root = document.createElement("div");
    root.classList.add("mc-players");

    var count = document.createElement("p");
    count.classList.add("mc-players-count");
    count.appendChild(document.createTextNode("Players: " + playersRaw["online"] + "/" + playersRaw["max"]));
    root.appendChild(count);

    var list = document.createElement("ul");
    list.classList.add("mc-players-list");

    if (playersRaw.hasOwnProperty("sample")) {
        playersRaw["sample"].forEach(function(player, index) {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(player["name"]));
            list.appendChild(li);
        });
    }

    root.appendChild(list);

    return root;
}

function mcHandleStatus(parent, server, code, status) {
    var root = document.createElement("div");
    root.classList.add("mc-status-root");

    // Server IP:
    var header = document.createElement("h1");
    header.classList.add("mc-status-header");
    header.appendChild(document.createTextNode(server));
    root.appendChild(header);

    // MOTD:
    var descriptionRaw = [{
        "bold": true,
        "color": "red",
        "italic": false,
        "obfuscated": false,
        "strikethrough": false,
        "text": "Server offline",
        "underlined": false
    }];

    if (code == 200) {
        descriptionRaw = status["description"];
    }
    var description = mcDescriptionToHTML(descriptionRaw);
    root.appendChild(description);

    // Player Status:
    if (code == 200) {
        var playersRaw = status["players"];
        var players = mcPlayersToHTML(playersRaw);
        root.appendChild(players);
    }

    parent.appendChild(root);
}

window.onload = function() {
    var elements = document.getElementsByClassName("mc-status");
    for (let element of elements) {
        mcStatus(element, element.attributes.getNamedItem("data-mc-server").value);
    }
}
