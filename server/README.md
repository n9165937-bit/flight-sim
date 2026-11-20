# Skyward multiplayer server

Your own server for Skyward: a WebSocket relay (one room per map) plus a kills/deaths
leaderboard. It runs on Cloudflare's free Workers plan.

## Deploy (about 5 minutes)

1. Make a free account at https://dash.cloudflare.com/sign-up
2. Install Node.js (https://nodejs.org), then in this `server` folder run:

   ```
   npx wrangler login
   npx wrangler deploy
   ```

3. Wrangler prints your address, e.g. `https://skyward-server.yourname.workers.dev`.

## Point the game at it

Open the game once with `?server=` and your address — it's remembered after that:

```
https://n9165937-bit.github.io/flight-sim/?server=wss://skyward-server.yourname.workers.dev
```

Or make it the default for everyone: add this line in `index.html` before `multiplayer.js` loads:

```html
<script>window.SKYWARD_SERVER='wss://skyward-server.yourname.workers.dev'</script>
```

With a server set, the menu shows the **leaderboard** (kills and deaths per pilot name).
Without one, the game keeps using the free public MQTT relay.

To go back to the public relay: `?server=` with nothing after it, or clear `sky_server` in the browser's local storage.
