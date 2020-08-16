function McStatus(parent, server) {
    loadStatus(parent, server, insertMcStatus);
}

function loadStatus(parent, server, callback) {
    const apiEndpoint = "http://localhost:5000/status?server="

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(parent, JSON.parse(this.responseText));
        }
    };

    xhr.open("GET", apiEndpoint + server, true);
    xhr.send();
}

function insertMcStatus(parent, status) {
    var statusDiv = document.createElement("code");
    statusDiv.appendChild(document.createTextNode(JSON.stringify(status)));
    parent.appendChild(statusDiv);
}

function makeHeader(title) {
    var headerDiv = document.createElement("div");

    var titleElm = document.createElement("h1");
    titleElm.appendChild(document.createTextNode(title));

    headerDiv.appendChild(titleElm);

    return headerDiv;
}

window.onload = function() {
    var demo = document.getElementById("demo");

    McStatus(demo, "mc.breq.dev:16000");
}
