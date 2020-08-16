from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from mcstatus import MinecraftServer

app = Flask(__name__)
CORS(app)


@app.route("/status")
@cross_origin()
def status():
    if request.args.get("server"):
        try:
            server = MinecraftServer.lookup(request.args["server"])
            status = server.status().raw
            return jsonify(status)
        except OSError:
            return jsonify({}), 502


if __name__ == "__main__":
    app.run("0.0.0.0")
