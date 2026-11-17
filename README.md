# Skyward — Flight Simulator

A browser flight sim with 8 airplanes (Skylark trainer, Vortex aerobatic, Kestrel twin, Meridian jet, PC-12, F-16, F/A-18, F-22) and 4 helicopters (Bell 407, UH-60 Black Hawk, AH-64 Apache, CH-47 Chinook), four maps (Green Valley, Red Rock Canyon, Alpine Peaks, Metro City) with runways and helipads, landing practice with scoring, ring courses, wind, and live multiplayer.

**Play:** https://n9165937-bit.github.io/flight-sim/

## Multiplayer
Open the game, type a pilot name in the menu, and fly. Everyone on the same map sees each other's planes with name tags. Positions are shared through a free public relay (HiveMQ), so there's nothing to set up — just send friends the link.

## Controls
W/S pitch · A/D roll · Q/E rudder · Shift/Z throttle (collective in helicopters) · F/V flaps · G gear · B brakes · K Cobra (fighters) · C camera · R reset · Esc menu

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
