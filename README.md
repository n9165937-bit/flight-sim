# Skyward — Flight Simulator

A browser flight sim with airplanes from trainers to fighters (Skylark, Vortex, Kestrel, Meridian, PC-12, F-14, F-16, F/A-18, F-22, A-10, F-15E, B-2, B-1B, SR-71, AC-130J, P-40), 4 helicopters (Bell 407, UH-60 Black Hawk, AH-64 Apache, CH-47 Chinook), six maps (Green Valley, Red Rock Canyon, Alpine Peaks, Metro City, Ocean Fleet, Desert Base) with runways and helipads, landing practice with scoring, ring courses, wind, and live multiplayer.

**Play:** https://n9165937-bit.github.io/flight-sim/

## Multiplayer
Open the game, type a pilot name in the menu, and fly. Everyone on the same map sees each other's planes with name tags. Positions are shared through a free public relay (HiveMQ), so there's nothing to set up — just send friends the link.
Want your own server with a kills/deaths leaderboard? See [server/README.md](server/README.md) (free Cloudflare Worker, about 5 minutes).

## Controls
W/S pitch · A/D roll · Q/E rudder · Shift/Ctrl throttle (collective in helicopters) · V/U flaps down/up · G gear · X brakes (airbrake in the air) · K Cobra (fighters) · C camera · Tab map · R reset · Esc menu
Combat: Space guns · M missile · B bomb · F flares · 1 switch missile · 2 switch bomb · N night vision · O O eject · T AC-130 gunship orbit

## Weather & settings
- Weather (Clear, Overcast, Rain, Snow, Fog) and time of day (Day, Dawn, Sunset, Night) are separate, so you can mix them — e.g. rain at sunset or fog at night. Change either any time from the pause menu.
- Your aircraft, map, airport, graphics, wind, weather, time of day, camera view and sound setting are saved automatically.

## Cockpits & night vision
- Every aircraft has a 3D cockpit (press C): live gauges or glass displays, moving stick/yoke and throttle, and a working HUD in the fighters.
- Military aircraft (F-16, F/A-18, F-22, Black Hawk, Apache, Chinook) get night vision in cockpit view at night. Toggle with N.

## Metro City
- Thousands of buildings, a river with three suspension bridges, a harbor and Metro City Airport.
- Two 400 m twin skyscrapers stand 36 m apart over the main avenue: fly between them.
- Helicopters can land on three rooftop helipads. Hitting a building is a crash.
- At night the windows and street lights come on.

## Heli Missions
- New mode on the menu (picks a helicopter for you if you're in a plane).
- Rescue: land beside stranded people (on the ground, on mountains, or city rooftops), then fly them to a hospital helipad.
- Cargo: hover over a crate to hook it on a 14 m rope, carry it (it swings and pulls on your helicopter), and lower it gently into the drop zone.
- Missions chain one after another; points for speed, best score saved per helicopter and map.

## Dogfight (PvP + AI)
- New mode on the menu. Pick how many AI pilots (rookies or aces) — or none for PvP only.
- Every aircraft has a gun (SPACE, with light aim assist near the lead pip). Military aircraft also carry heat-seeking missiles (X, lock on for ~1 s) and flares (L).
- Players on the same map in Dogfight mode can shoot each other: hits, missiles and kills are shared over the multiplayer server, with a kill feed and K/D score. AI pilots are on your screen only.
- Shot down? You respawn after 4 seconds and keep your score.

## Ocean Fleet
- Open ocean with islands, a volcano and Kai Island Naval Air Station.
- Two aircraft carriers (USS Liberty and USS Resolute) with destroyer escorts.
- Carrier landings: gear down, fly the 3.5° glide slope to the angled deck and catch an arresting wire (aim for the 3-wire). Miss them and it's a bolter — go around. Throttle back to release the wire.
- Carrier takeoffs: Runway mode on a carrier puts you on the catapult — full throttle to launch.
- Helicopters can use the carrier helo spots for missions.

## A-10 Warthog & F-15E Strike Eagle
- A-10: slow, tough close-air-support jet with the GAU-8 cannon (4x damage on ground targets), Mavericks and bombs.
- F-15E: big two-seat strike fighter with afterburners, missiles and 8 laser-guided bombs.

## Strike Missions (ground attack)
- New mode: destroy armor columns, SAM sites, supply depots and tank companies. Missions chain with increasing defenses.
- AAA guns shoot back up close; SAM radars can only lock you between 500 and 8,000 ft above the ground — go lower or higher and they can't fire, and missiles already in the air lose their lock. The HUD shows SAM RADAR: TRACKING / TOO LOW / TOO HIGH. Flares (L) also work.
- Weapons: guns (SPACE), missiles (X, lock ground targets too), bombs (J). The yellow ring (CCIP) shows where a dumb bomb will land; with a lock, bombs are laser-guided.
- Score per target + time bonus; best score saved per aircraft and map.

## Real-scale jet models
- The F-16, F/A-18, F-22, A-10 and F-15E use the real-scale models from the Hangar project (published length, span and height; FS595 paint schemes; panel lines; weapons on the pylons).
- AI pilots, other players and parked jets use a lighter version of the same models; so does your own jet on Low graphics.

## Location damage
- In Dogfight and Strike, hits land on the part they strike. Enough damage and that part breaks off and falls away smoking:
  - Wing: big roll toward the missing side and lost lift — fight it with the stick.
  - Tail: pitch and yaw go wild (helicopters spin).
  - Engine: fire, smoke and most thrust gone.
- AI planes that lose a wing or tail spiral in — you get the kill. Other players see your missing parts.

## Sound
- Guns, missile launches and explosions are positional: volume drops with distance, far-off blasts sound muffled, they pan left/right, and the boom arrives late (sound travels at 343 m/s).
- Missiles hiss as they fly past you. The nearest other aircraft roars louder as it passes, with Doppler pitch.
- Every aircraft has its own engine sound: afterburner rumble, the A-10's turbine whine and its GAU-8 BRRRT (with spin-up, and the echo that rolls back off the hills after each burst), the Chinook's slow heavy thump.

## Combat extras
- **Damage diagram** (top left in combat): each wing, the tail and the engine turn yellow then red as they take hits, and flash once they're gone.
- **Eject**: press O twice (or EJECT twice on touch). Your seat fires, the chute opens, and the jet spins in on fire. Shot-down planes now fall burning instead of vanishing — and so do the AI's, with a parachute.
- **Repair & rearm**: stop on any runway, carrier deck or helipad for 4 seconds — lost parts come back, weapons reload, tanks fill.
- **Wingmen** (menu: 0–2): fly in formation off your wing, then go after enemy fighters or strafe ground targets in Strike.
- **Fuel**: burns in Dogfight and Strike (afterburner drinks it). Land to refuel or use the tanker.

## Air refueling
- New mode **Air Refueling**: start low on fuel behind a big tanker. Slide up under the boom, follow the FWD/UP/LEFT cues, hold steady and the boom connects. Fill up as fast as you can — your best time is saved.
- In Dogfight and Strike the tanker flies a racetrack over the map (blue TANKER marker) for jets that need fuel.

## New aircraft
- **B-2 Spirit**: 52 m flying wing with 16 bombs and no guns.
- **AC-130J Ghostrider**: four-prop gunship. Press **T** for a gunship orbit — it flies a left-hand circle on its own while you aim the side guns through a thermal camera: Space = 30 mm, M = 105 mm.
- The jets' ailerons, flaps, stabilators and rudders now move with your controls.

## Desert Base
- Sahra Air Base with two runways and hardened aircraft shelters, dune fields, an oasis, and a mesa to the north cut by a winding canyon — the Ring Course runs through it.

## Liveries & airbrakes
- Pick a **livery** under the aircraft list in the menu. Every aircraft has two or three liveries made just for it (marked ★ — e.g. the F-16's Demo Team and Tiger Meet, the F-22's Checker Tail, the Chinook's Firefighter), plus the shared ones. Fighters and the B-2/AC-130 get camo schemes (Aggressor Blue, Desert, Arctic, Black Ops, Jungle, Show Red, Navy Gray); civil planes get color schemes; the military helicopters get Desert Tan, Navy Gray, Rescue, Night Black and Coast Guard Orange. Your choice is saved per aircraft, and other players see it.
- Hold **X** (BRAKE on touch) in the air for the **airbrake**: the F-15E and F/A-18 raise the big panel on the back; the F-16, F-22, A-10 and B-2 split their ailerons open like a clamshell. It adds a lot of drag to slow down fast.

## Weapons & loadouts
- New detailed models: AIM-9X Sidewinder, AIM-120 AMRAAM, AGM-65 Maverick, AGM-114 Hellfire, Mk-82, GBU-12 Paveway II and GBU-31 JDAM. Missiles fly with a motor flame; GBU-12 tail wings unfold after release.
- **Loadout**: in the menu next to Livery, pick **two** weapon types for your aircraft (or just one). Each gets half the plane's weight limit — or all of it if it's alone — and the counts are filled in for you. They hang on the pylons and disappear as you fire them.
- **Flares**: 30 per sortie (refilled when you respawn or rearm).
- Each weapon behaves differently: Sidewinder (short range, agile, fooled by flares), AMRAAM (7.5 km lock, harder to decoy), Maverick and Hellfire (lock ground targets), Mk-82 (unguided — use the pipper), GBU-12 (laser-guided to your lock), JDAM (GPS: hits your lock or the pipper point, huge blast).
- In flight: **1** switches missile type, **2** switches bomb type (MSL ▸ / BMB ▸ on touch). The HUD shows what's selected.
- Loadouts: F-16 / F/A-18 (Sidewinder, AMRAAM, Maverick, Mk-82, GBU-12), F-22 (Sidewinder, AMRAAM, GBU-12), A-10 (Sidewinder, AMRAAM, Maverick, Mk-82, GBU-12), F-15E (all but Hellfire), B-2 (Mk-82, GBU-12, JDAM), Apache (Hellfire, Sidewinder).

## B-1B Lancer, SR-71 Blackbird, P-40 Warhawk
- **B-1B Lancer**: swing-wing bomber with four afterburning engines and 24 JDAMs. The wings spread for takeoff and landing and sweep back as you speed up.
- **SR-71 Blackbird**: Mach 3 spy plane. Handles like a big jet down low; climb past 60,000 ft and it keeps accelerating toward Mach 3. No weapons.
- **P-40 Warhawk**: WWII shark-mouth fighter with six .50 cals and one 500 lb bomb; flies Dogfight and Strike.
- **F-14 Tomcat**: twin-tail Navy fighter with swing wings that sweep back as you speed up; Sidewinders, AMRAAMs and GBU-12s, and it launches and traps on the carriers.

## RC transmitter (Spektrum WS1000 / WS2000 / WS3000T dongle)
Fly with your real RC radio. The Spektrum wireless simulator dongle shows up as a USB joystick, which the browser can read (Chrome or Edge on PC/Mac, Chrome on Android).
1. Bind your DSMX/DSM2 transmitter to the dongle (hold the bind button while plugging it in, then put the radio in bind mode).
2. Open the game, **move a stick** (browsers only show a controller after it moves), then in the menu press **RC TRANSMITTER**.
3. Press **RUN SETUP WIZARD** and follow the steps: throttle, aileron, elevator, rudder, then the **trainer/bind button for guns** (hold it while pressing NEXT), then optional switches for gear, flaps, missile, bomb and flares. Without setup, any button on the dongle fires the guns. It finds which channel is which and whether it needs reversing.
4. Adjust **Expo** if the sticks feel too twitchy. Your setup is saved.
**Spektrum DX4e (default preset, mode 2):** left stick up/down = throttle, left stick left/right = yaw, right stick up/down = pitch, right stick left/right = roll, trainer/bind button = guns, ACT/AUX switch ON = airbrake + wheel brakes, HI/LO rate switch HI = gear down / LO = gear up. Everything else stays on the keyboard. The HI/LO switch has no channel of its own (it only cuts stick travel to 70%), so after flipping it, push the right stick fully to one side once: full travel = HI, a steady 70% max = LO. Press **SPEKTRUM DX4e PRESET** in the RC panel to restore it.
The throttle stick sets throttle directly (collective in helicopters). Any channel can also be set by hand, with a reverse box, and the live bars show every channel.
