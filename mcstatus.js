function mcStatus(parent, server) {
    loadStatus(parent, server, handleStatus);
}

function loadStatus(parent, server, callback) {
    const apiEndpoint = "https://mc-status-relay.herokuapp.com/status?server="

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            console.log(this.responseText);
            callback(parent, {"status": this.status, "result": JSON.parse(this.responseText)});
        }
    };

    xhr.open("GET", apiEndpoint + server, true);
    xhr.send();
}

function mcDescriptionToHTML(descriptionRaw) {
    if (typeof descriptionRaw == "object") {
        return mcExtraDescriptionToHTML(descriptionRaw["extra"]);
    } else {
        var root = document.createElement("div");
        root.classList.add("mc-description");

        description = descriptionRaw.replace(/\xa7./g, "");

        root.appendChild(document.createTextNode(description));
        return root;
    }
}

function mcExtraDescriptionToHTML(descriptionRaw) {
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

function handleStatus(parent, result) {
    var code = result["status"];
    var status = result["result"];

    var root = document.createElement("div");
    root.classList.add("mc-status-root");

    // MOTD:
    var descriptionRaw = {"extra": [{
        "bold": true,
        "color": "red",
        "italic": false,
        "obfuscated": false,
        "strikethrough": false,
        "text": "Server offline",
        "underlined": false
    }]};

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
