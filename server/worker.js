// Skyward multiplayer server — a Cloudflare Worker with Durable Objects.
//  • /room/<map>?id=<pilotId>  WebSocket relay: every message a pilot sends goes to everyone else on that map.
//  • /leaderboard              GET: top pilots by kills (JSON).
// One Durable Object per map keeps the sockets; one more ("board") keeps the leaderboard.

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' };
const MAPS = ['valley', 'canyon', 'alpine', 'city', 'ocean', 'desert'];

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (url.pathname === '/leaderboard') {
      const stub = env.ROOMS.get(env.ROOMS.idFromName('board'));
      return stub.fetch('https://board/leaderboard');
    }
    const m = url.pathname.match(/^\/room\/([a-z]+)$/);
    if (m && MAPS.includes(m[1])) {
      if (req.headers.get('Upgrade') !== 'websocket') return new Response('WebSocket expected', { status: 426 });
      const stub = env.ROOMS.get(env.ROOMS.idFromName('map:' + m[1]));
      return stub.fetch(req);
    }
    return new Response('Skyward server is running. Point the game at wss://' + url.host, { headers: CORS });
  }
};

export class Room {
  constructor(state, env) { this.state = state; this.env = env; }

  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/leaderboard') return this.leaderboard();
    if (url.pathname === '/score') return this.score(await req.json());
    const pair = new WebSocketPair();
    const id = (url.searchParams.get('id') || '').replace(/[^a-z0-9]/gi, '').slice(0, 12) || Math.random().toString(36).slice(2, 10);
    this.state.acceptWebSocket(pair[1], [id]);          // hibernation API: sockets survive while the object sleeps
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  async webSocketMessage(ws, data) {
    if (typeof data !== 'string' || data.length > 4000) return;
    let msg; try { msg = JSON.parse(data); } catch (e) { return; }
    if (msg && msg.score) {                               // kills / deaths → the shared leaderboard
      const stub = this.env.ROOMS.get(this.env.ROOMS.idFromName('board'));
      await stub.fetch('https://board/score', { method: 'POST', body: JSON.stringify(msg.score) });
      return;
    }
    if (!msg || typeof msg.t !== 'string') return;
    for (const other of this.state.getWebSockets()) if (other !== ws) { try { other.send(data); } catch (e) {} }
  }

  async webSocketClose(ws) { this.left(ws); }
  async webSocketError(ws) { this.left(ws); }
  left(ws) {
    const [id] = this.state.getTags(ws);
    // tell everyone this pilot is gone (like the MQTT "last will")
    for (const other of this.state.getWebSockets()) if (other !== ws) { try { other.send(JSON.stringify({ t: '__left', m: id })); } catch (e) {} }
  }

  async score(s) {
    const n = String(s.n || 'Pilot').replace(/[<>&"]/g, '').slice(0, 14);
    const board = (await this.state.storage.get('board')) || {};
    const r = board[n] || { n, k: 0, d: 0 };
    r.k += Math.max(0, Math.min(5, s.k | 0)); r.d += Math.max(0, Math.min(5, s.d | 0)); r.t = Date.now();
    board[n] = r;
    const names = Object.keys(board);                     // keep the 500 most recently active pilots
    if (names.length > 500) names.sort((a, b) => board[a].t - board[b].t).slice(0, names.length - 500).forEach(k => delete board[k]);
    await this.state.storage.put('board', board);
    return new Response('ok', { headers: CORS });
  }

  async leaderboard() {
    const board = (await this.state.storage.get('board')) || {};
    const rows = Object.values(board).sort((a, b) => b.k - a.k || a.d - b.d).slice(0, 20).map(({ n, k, d }) => ({ n, k, d }));
    return new Response(JSON.stringify(rows), { headers: Object.assign({ 'Content-Type': 'application/json' }, CORS) });
  }
}
