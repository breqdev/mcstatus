# McStatus

**Live demo at [breq.dev/apps/mcstatus.html](https://breq.dev/apps/mcstatus.html)!**

A JavaScript library to embed a Minecraft server status readout.

Include the library:

```
<script type="text/javascript" src="https://github.breq.dev/mcstatus/mcstatus.js"></script>
```

Then, in your document, create elements for embeds with:

```
<div class="mc-status" data-mc-server="[server IP]"></div>
```

### Code structure

`mcstatus.js` loads a stylesheet into `<head>` to style the embeds. It then loads a div complete with Minecraft server information into the DOM wherever it finds a `<div class="mc-status">`, using the `data-mc-server` attr to set the server IP.

The status protocol for Minecraft servers uses raw TCP sockets, so a pure-JS server query-er isn't possible. There are a lot of existing Minecraft server status tools, like [mcsrvstat.us](https://api.mcsrvstat.us/), but they don't have a CORS header set, so they couldn't be used from JavaScript. So, I implemented my own at `https://mcstatus.breq.dev/` with the bare minimum API for this project to work. If you want to run your own relay, `pip3 install -r requirements.txt` and run the `relay.py` file.

I'm using Dinnerbone's awesome [Server Pinger](https://github.com/Dinnerbone/mcstatus) under the hood on the relay.

To change the style of the embed, just add a stylesheet that overrides the styles at [mcstatus.css](https://github.com/breqdev/mcstatus/blob/master/mcstatus.css).
