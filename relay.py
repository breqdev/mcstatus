from flask import Flask, request, jsonify, send_file, redirect
from flask_cors import CORS, cross_origin

from mcstatus import JavaServer

app = Flask(__name__)
CORS(app)


color_codes = {
    "4": "dark_red",
    "c": "red",
    "6": "gold",
    "e": "yellow",
    "2": "dark_green",
    "a": "green",
    "b": "aqua",
    "3": "dark_aqua",
    "1": "dark_blue",
    "9": "blue",
    "d": "light_purple",
    "5": "dark_purple",
    "f": "white",
    "7": "gray",
    "8": "dark_gray",
    "0": "black",
}


def process_color_codes(raw_desc):
    if isinstance(raw_desc, dict):
        if raw_desc.get("extra"):
            return raw_desc["extra"]
        raw_desc = raw_desc["text"]

    description = []

    token = ""
    params = {"color": "default"}

    desc_iter = iter(raw_desc)
    try:
        while True:
            char = next(desc_iter)
            if char != "§":
                token += char
            else:
                if token:
                    description.append({"text": token, **params})
                token = ""

                code = next(desc_iter)

                if code in color_codes:
                    params["color"] = color_codes[code]
                elif code == "l":
                    params["bold"] = True
                elif code == "o":
                    params["italic"] = True
                elif code == "n":
                    params["underlined"] = True
                elif code == "m":
                    params["strikethrough"] = True
                elif code == "k":
                    params["obfuscated"] = True
                elif code == "r":
                    params = {"color": "default"}

    except StopIteration:
        pass

    if token:
        description.append({"text": token, **params})

    return description


@app.route("/status")
@cross_origin()
def status():
    if request.args.get("server"):
        try:
            server = JavaServer.lookup(request.args["server"])
            raw_status = server.status().raw

            status = {
                "description": process_color_codes(raw_status["description"]),
                "players": raw_status["players"],
            }
            return jsonify(status)
        except OSError:
            return jsonify({}), 404


@app.route("/")
def index():
    return redirect("https://breq.dev/apps/mcstatus.html")


@app.route("/mcstatus.css")
def css():
    return send_file("mcstatus.css")


@app.route("/mcstatus.js")
def js():
    return send_file("mcstatus.js")


if __name__ == "__main__":
    app.run("0.0.0.0")
