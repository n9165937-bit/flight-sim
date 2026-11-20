// Skyward multiplayer — shares every pilot's plane through a free public MQTT relay (no account needed).
// Players on the same map see each other. Loaded after the main game script.
(function () {
  'use strict';
  const BROKER = 'wss://broker.hivemq.com:8884/mqtt';
  const BASE = 'skyward-flightsim-n9165937/v1/' + MAP + '/';
  const SEND_HZ = 10, TIMEOUT = 4000;
  const myId = Math.random().toString(36).slice(2, 10);
  let myName = (localStorage.getItem('sky_name') || ('Pilot' + Math.floor(100 + Math.random() * 900))).slice(0, 14);

  // ---- pilot name box in the menu ----
  const opts = document.querySelector('.opts');
  if (opts) {
    const l = document.createElement('label');
    l.textContent = 'Pilot ';
    const inp = document.createElement('input');
    inp.maxLength = 14; inp.value = myName;
    inp.style.cssText = 'background:rgba(20,45,70,.8);color:#fff;border:1px solid rgba(160,220,255,.35);border-radius:8px;padding:6px 8px;font:600 14px Rajdhani,sans-serif;width:120px';
    inp.addEventListener('keydown', e => e.stopPropagation());
    inp.onchange = () => { const v = inp.value.trim().slice(0, 14); if (v) { myName = v; localStorage.setItem('sky_name', v); } };
    l.appendChild(inp); opts.prepend(l);
  }

  // ---- online badge ----
  const badge = document.createElement('div');
  badge.style.cssText = 'position:fixed;left:50%;top:50px;transform:translateX(-50%);z-index:5;padding:3px 10px;border-radius:8px;background:rgba(8,18,28,.6);border:1px solid rgba(160,220,255,.25);font:600 12px Rajdhani,sans-serif;letter-spacing:1px;color:#cfe6f7;pointer-events:none;white-space:nowrap;max-width:70vw;overflow:hidden;text-overflow:ellipsis';
  document.body.appendChild(badge);
  const setBadge = () => {
    const names = Object.values(others).map(o => o.name);
    badge.textContent = !client || !client.connected ? '○ Multiplayer connecting…'
      : names.length ? `● ${names.length + 1} pilots online: you, ${names.join(', ')}` : '● Online: waiting for other pilots';
    badge.style.color = client && client.connected ? '#7dffb0' : '#ffcf4a';
  };

  if (!window.mqtt) { badge.textContent = 'Multiplayer unavailable'; return; }

  const others = {};
  const client = mqtt.connect(BROKER, {
    clientId: 'sky_' + myId, clean: true, keepalive: 20, reconnectPeriod: 3000, connectTimeout: 8000,
    will: { topic: BASE + myId, payload: '', qos: 0, retain: false }
  });
  client.on('connect', () => { client.subscribe(BASE + '+'); setBadge(); });
  client.on('close', setBadge); client.on('offline', setBadge); client.on('error', setBadge);

  // ---- name tag ----
  function drawTag(s, dist) {
    const { c, g, name } = s.userData; g.clearRect(0, 0, c.width, c.height);
    g.font = 'bold 44px Arial'; const w = Math.min(500, g.measureText(name).width + 44);
    g.fillStyle = 'rgba(4,12,20,.78)'; g.strokeStyle = '#7dffb0'; g.lineWidth = 4;
    g.beginPath(); g.roundRect ? g.roundRect(256 - w / 2, 6, w, 62, 14) : g.rect(256 - w / 2, 6, w, 62); g.fill(); g.stroke();
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 6; g.strokeStyle = '#000'; g.strokeText(name, 256, 39); g.fillStyle = '#9dffc4'; g.fillText(name, 256, 39);
    g.font = 'bold 30px Arial'; const dt = dist < 1000 ? Math.round(dist) + ' m' : (dist / 1000).toFixed(1) + ' km';
    g.strokeStyle = '#000'; g.lineWidth = 5; g.strokeText(dt, 256, 94); g.fillStyle = '#ffffff'; g.fillText(dt, 256, 94);
    g.fillStyle = '#7dffb0'; g.beginPath(); g.moveTo(256, 140); g.lineTo(240, 116); g.lineTo(272, 116); g.closePath(); g.fill();
    s.material.map.needsUpdate = true; s.userData.shown = dt;
  }
  function nameTag(name) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 144;
    const g = c.getContext('2d');
    // screen-sized tag: stays readable at any distance, ignores fog and night
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false, transparent: true, fog: false, sizeAttenuation: false }));
    s.center.set(0.5, 0); s.scale.set(0.62, 0.174, 1); s.renderOrder = 10; s.userData = { c, g, name, t: 0 }; drawTag(s, 0); return s;
  }
  function removeOther(id) { const o = others[id]; if (!o) return; scene.remove(o.model.g); scene.remove(o.tag); delete others[id]; setBadge(); }

  // ---- receive ----
  const num = v => (typeof v === 'number' && isFinite(v)) ? v : 0;
  client.on('message', (topic, msg) => {
    const id = topic.slice(BASE.length);
    if (!id || id === myId) return;
    if (id === 'evt') { onEvent(msg); return; }
    if (!msg || !msg.length) { removeOther(id); return; }
    let d; try { d = JSON.parse(msg.toString()); } catch (e) { return; }
    const type = SPECS[d.p] ? d.p : 'skylark';
    const name = String(d.n || 'Pilot').slice(0, 14);
    let o = others[id];
    if (!o || o.type !== type || o.name !== name) {
      if (o) { scene.remove(o.model.g); scene.remove(o.tag); }
      const model = makePlane(type); scene.add(model.g);
      const tag = nameTag(name); scene.add(tag);
      model.g.position.set(num(d.x), num(d.y), num(d.z));
      o = others[id] = { model, tag, type, name };
      setBadge();
    }
    o.tPos = new THREE.Vector3(num(d.x), num(d.y), num(d.z));
    o.tVel = new THREE.Vector3(num(d.vx), num(d.vy), num(d.vz));
    o.tQ = new THREE.Quaternion(num(d.qx), num(d.qy), num(d.qz), num(d.qw) || 1).normalize();
    o.tTime = performance.now(); o.gear = d.g ? 1 : 0; o.ab = num(d.ab);
    o.df = d.m === 1; o.hp = num(d.hp); o.fire = d.f === 1;
  });

  // ---- send ----
  let flying = false;
  const r2 = n => Math.round(n * 100) / 100, r4 = n => Math.round(n * 10000) / 10000;
  setInterval(() => {
    if (!client.connected) return;
    if (state !== 'play' || P.crashed) { if (flying) { client.publish(BASE + myId, ''); flying = false; } return; }
    flying = true;
    client.publish(BASE + myId, JSON.stringify({
      n: myName, p: SP.id, x: r2(P.pos.x), y: r2(P.pos.y), z: r2(P.pos.z),
      qx: r4(P.q.x), qy: r4(P.q.y), qz: r4(P.q.z), qw: r4(P.q.w),
      vx: r2(P.vel.x), vy: r2(P.vel.y), vz: r2(P.vel.z), g: P.gearT > .5 ? 1 : 0,
      ab: SP.ab ? r2(Math.max(0, (P.spool - .6) / .4)) : 0,
      m: DF.on && !DF.strike ? 1 : 0, hp: DF.on ? Math.round(DF.hp) : 100, f: DF.on && DF.netFire > 0 ? 1 : 0
    }));
  }, 1000 / SEND_HZ);
  addEventListener('beforeunload', () => { try { client.publish(BASE + myId, ''); client.end(true); } catch (e) {} });

  // ---- smooth other planes between updates ----
  (function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    for (const id in others) {
      const o = others[id];
      if (now - o.tTime > TIMEOUT) { removeOther(id); continue; }
      if (!o.tPos) continue;
      const ahead = o.tPos.clone().addScaledVector(o.tVel, Math.min((now - o.tTime) / 1000, 0.5));
      o.model.g.position.lerp(ahead, 0.25);
      o.model.g.quaternion.slerp(o.tQ, 0.25);
      o.tag.position.copy(o.model.g.position).y += 4;
      if (now - o.tag.userData.t > 400) { o.tag.userData.t = now; const d = camera.position.distanceTo(o.model.g.position); drawTag(o.tag, d); }
      for (const p of o.model.props) p.rotation.z += 0.7;
      for (const r of (o.model.rotors || [])) r.p.rotation[r.axis] += r.k * 0.016;
      for (const d of (o.model.rdiscs || [])) d.material.opacity = 0.12;
      for (const m of o.model.gearParts) m.visible = !!o.gear;
      for (const f of o.model.flames) { f.visible = o.ab > .05; f.scale.set(1, 1, .35 + o.ab * 1.3); }
    }
  })();
  // ---- dogfight PvP: shooter reports gun hits, victim simulates missiles fired at them ----
  function onEvent(msg) {
    let e; try { e = JSON.parse(msg.toString()); } catch (er) { return; }
    if (!e || e.from === myId || typeof DF === 'undefined') return;
    const fn = String(e.fn || 'Pilot').slice(0, 14);
    if (e.t === 'hit' && e.to === myId && DF.on) { DF.lastHitBy = e.from; dfDamage(Math.min(80, num(e.dmg)), fn); }
    else if (e.t === 'msl' && e.to === myId && DF.on && !P.crashed && Array.isArray(e.p)) {
      const V = THREE.Vector3; dfFireMissile(new V(num(e.p[0]), num(e.p[1]), num(e.p[2])), new V(num(e.v[0]), num(e.v[1]), num(e.v[2])), new V(num(e.d[0]), num(e.d[1]), num(e.d[2])).normalize(), 'me', { name: fn }, true);
      DF.msl[DF.msl.length - 1].from = e.from; showMsg('MISSILE LAUNCH', fn + ' fired at you · turn hard / flares (L)', '#ff4040', 2500);
    }
    else if (e.t === 'kill') { if (DF.on) dfFeed(String(e.k).slice(0, 14) + ' ✈ ' + String(e.v).slice(0, 14)); if (e.kid === myId && DF.on) { DF.k++; showMsg('SPLASH ONE', String(e.v).slice(0, 14) + ' shot down · ' + DF.k + ' kills', '#ffd27a', 2200); } }
  }
  window.MP = {
    name: () => myName,
    send: e => { if (client.connected) client.publish(BASE + 'evt', JSON.stringify(Object.assign({ from: myId, fn: myName }, e))); },
    targets: () => Object.entries(others).filter(([, o]) => o.df && o.tPos).map(([id, o]) => o.tgt || (o.tgt = { id, isPlayer: true, get name() { return o.name; }, get pos() { return o.model.g.position; }, get vel() { return o.tVel; }, get hp() { return o.hp; }, r: Math.max(5, SPECS[o.type].span * .55), alive: true })),
    firing: () => Object.values(others).filter(o => o.df && o.fire).map(o => ({ pos: o.model.g.position, f: new THREE.Vector3(0, 0, -1).applyQuaternion(o.model.g.quaternion) }))
  };
  setInterval(setBadge, 2000); setBadge();
})();
