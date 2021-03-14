# Uprooted: Meal Replacement Game
## wut
A turn-based farming RPG.
## disclaimer
There is some strong language in the game's text, as well as in some of the source code because I am 12 years old and think seeing a rabbit say bad words is funny.
## license
This game's source code is licensed with the [GNU Affero General Public License](https://www.gnu.org/licenses/agpl-3.0.en.html). All art assets are licensed with the [CC BY-SA 4.0 License](https://creativecommons.org/licenses/by-sa/4.0/legalcode).
## why
Sometimes I make choices. They aren't always good ones.
## building
Running a `npm install` should get you pretty much everything you need to build this. It's all node based. You'll need [ffmpeg](https://ffmpeg.org/) for one of the (optional) build steps, though. All build scripts are in the **tools** directory.

- `BuildCollisions.js`: Builds collision data based off the files in **tools/collisionimg**, which are in turn generated from **TODO: populate *collisionimg* in script.**. **tools/cave.png** is also converted into collision data.
- `BuildEnemyAttacks.js`: Builds enemy attack flows based off the files in **tools/enemyjson**, which are in turn generated with [kelly](https://github.com/HauntedBees/kelly).
- `BuildImages.js`: Generate PNGs from the contents of the **tools/ora** folder. With no parameters passed it should generate every image needed for the game. **TODO: finish converting PDNs to ORAs and making accompanying scripts.**
- `BuildSpreadsheets.js`: Generates game data from the spreadsheets in the **tools/ods** folder. With no parameters passed it should generate all data needed for the game.
- `Cordova.js`: Copies all generated files to the **cordova/www** folder for building with Cordova. **TODO: automate other Cordova-related functionalities.**
- `FormatImages.js`: Generates upscaled sprites for optional in-game graphical filters. Requires [ffmpeg](https://ffmpeg.org/). **TODO: try adding scale4x back.**
- `Package.js`: Concatenates all source files into one **out.js** file. Calling it with the `min` argument will also minify it.
- `gulpfile.js`: Calling `gulp watch` will ensure `Package.js` is executed every time a source file is updated.

### Standard Build
Run `node tools/Package.js` to build everything. All standard spritesheets and game datas are pre-built in the the git repository, but if you have made changes, you will need to run the appropriate script described above. Likewise, if you wish to include the upscaled sprites, you will need to run `node tools/FormatImages.js`. After building, run `index.html` in your browser to play.

### Android Build
Complete all the Standard Build steps above, then run:
```
node tools/Cordova.js
cd cordova
cordova build android --release
cd platforms/android/app/build/outputs/apk/release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore [yourKeyStore] app-release-unsigned.apk [yourKey]
zipalign -v 4 app-release-unsigned.apk Uprooted.apk
```

### Electron Build
Complete all the Standard Build steps above.
**Dev Build:** `npm start`
**Package Only:** `npm pack`
**Package for Distribution:** `npm run dist`

## want to make changes?
The game isn't even done yet hold your horses yo.

## additional assets
Pretty much all sound effects are taken from [512 Sound Effects (8-Bit Style)](https://opengameart.org/content/512-sound-effects-8-bit-style) by [Juhani Junkala](https://juhanijunkala.com/) and are licensed under the [CC 1.0 Universal License](https://creativecommons.org/publicdomain/zero/1.0/).