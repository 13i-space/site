# SalienT stage for Rave Mode (Update 6.43)

The 3D Rave for Ominous with the SalienT cast: Chephro on the decks, the other
seven on the floor, the Temple Warden now and then (12% of plays). It's mounted
by `components/SalientRave.js` inside Rave Mode; the song is played by The
Rave's own player and this only reads its clock.

Not part of the Next build: it's prebuilt into `public/rave/salient/salient-rave.js`
(three.js bundled in), with the characters in `public/rave/salient/models/`
(the SalienT models, meshopt removed so a plain loader reads them).

## Rebuild after changing anything in src/

    cd rave-src/salient
    npm i --no-save three@0.170 esbuild
    npx esbuild src/mount.js --bundle --format=iife --minify --outfile=../../public/rave/salient/salient-rave.js

## Files
- `song.js` - Ominous measured: beat grid (same as lib/rave/beatData.js), bass/mid/hat loudness per 16th, the song's sections, drops
- `show.js` - who dances when, formations, moves, lights, crowd, cameras
- `dj.js` - the booth and Chephro working it (arm IK, a tentacle per control)
- `stage.js` - floor, LED wall, truss and moving heads, lasers, speakers, crowd of aliens
- `chars.js` - loading the models, sharing dance clips between the Mixamo rigs
- `logo.js` - the SalienT logo, as the game ships it
- `mount.js` - renderer, post effects, the mount API (`window.SalientRave.mount`)

A new song needs its own `song.js` data (sections, drops, the band loudness);
everything else carries over.
