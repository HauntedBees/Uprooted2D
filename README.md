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

### Build Scripts

#### BuldCollisions.js
Builds collision data based off the files in **tools/collisionimg**, which are in turn generated from **BuildImages.js**. **tools/cave.png** is also converted into collision data.

Collision datas are arrays of bools, where `true` means a tile is solid and cannot be walked through. In the image files, a tile will be read as `true` if the corresponding pixel is `#FF0000` and `false` otherwise.

Cave Collision is more complicated and the structure is described in the comments of the `BuildCaveCollisions` function.

#### BuildEnemyAttacks.js
Builds enemy attack flows based off the files in **tools/enemyjson**, which are in turn generated with [kelly](https://github.com/HauntedBees/kelly).

#### BuildImages.js
Generate PNGs from the contents of the **tools/ora** folder. With no parameters passed it should generate every image needed for the game.

The following arguments can be supplied (all `.ora` files referenced are in `tools/ora`):

 - `bg`: Copies all layers from `combatbg.ora` into separate PNGs in `img/bgs`.
 - `profile`: Copies all layers from `portraits.ora` (except ones with names starting with "_") into separate PNGs in `img/profiles`.
 - `maps`: Goes through all files in `tools/ora/maps` and populates `img/maps`, `img/fg`, and `tools/collisionimg` based on their layers. Maps are generated from all layers not prefixed with `_` except `Foreground` and `Collision`. Foregrounds are generated from the `Foreground` layer, and collision images are generated from the `Collision` layer. If a map has cover layers, they should be named with the `_Cover:xxx` convention and specified in the `covers` variable in the `RipMaps` function in the format of `"mapName": ["xxx"]`. A few custom rules exist for handling the `northcity` and `hq_IB` maps.
 - `cavecollisions`: Builds `tools/cave.png` used for `BuildCollisions.js`.
 - `basics`: Equivalent to passing all of the `tools/ora` filenames at once (see next item).
 - Pretty much any of the files in `tools/ora` without their file extensions: Copies the `Content` layer of each file (ex. `sheet` maps to `sheet.ora`) into `img/`.

**TODO: *shop_XXX.ora*, *logo.ora*, *colorPreview.ora*, and *endcredits.ora* files still require manual export.**

#### BuildMonochrome.js
Copies all images from **img** into **imggb** after converting them to a 4-color monochrome color scheme.

**TODO: Sprites *FarmInfo%*, *MetalInfo%*, *BtlSel%*, *CornerBtn%*, and *%Sel%* must be manually set to the maximum brightness.**
**TODO: Sprites *%cursor%.%* and *optTile* must be manually corrected.**

#### BuildSpreadsheets.js
Generates game data from the spreadsheets in the **tools/ods** folder. With no parameters passed it should generate all data needed for the game.

The following arguments can be supplied (all `.ods` files referenced are in `tools/ods`, all `.js` files referenced are in `js/gamedata` unless otherwise specified):
 - `T`: Convert rows from `Details_Text.ods` into the `fulltext` map in `text.js`. Spreadsheet is one header row and then several rows with the following columns:
	- `Key`: The reference key for the line of text.
	- `noTrim`: If not set, the end of the line of text will be trimmed off.
	- `profile`: The name of the profile image to show if this text is displayed in world map dialogue.
	- `type`: How the text is used in game. For reference; not used in-game.
	- `en-us`: The English translation of the text.
	- `en-us-sfw`: The profanity-free English translation.
	- `any other language`: Other languages can be defined after `en-us` and `en-us-sfw`, one per column. If a value does not exist in this language, the game will default to the `en-us` translation. **Note:** there is no way to change languages in-game at this time.
 - `S`: Converts rows from `Details_Cutscenes.ods` into the `scripts` map in `cutscenes.js`. Spreadsheet is one header row and rows with `Key` and `Action` columns. `Key` is the in-game reference key, and `Action` is a `&`-separated list of commands that are parsed in `js/worldmap/cutsceneParser.js`.
 - `C`, `Q`, `F`, `E`: Rips crops, equipment, fixtures, and enemies into their respective files in `js/gamedata`.
 - `P`: Converts cells from `Details_BigSprites.ods` and `Details_SmallSprites.ods` into the `sprites` map in `spritedata.js`. For each cell with coordinates `(x, y)` and a value `v`, they will be converted to the a key-value pair of the format `"v": [x, y]`, or `"v": [x, y, true]` for cells ripped from `Details_BigSprites.ods`. 

#### Cordova.js
Run with `node tools/Cordova.js ARG` where `ARG` can be:
 - `copy`: Copies all production files to the **cordova/www** folder for building with Cordova.
 - `build`: Build, sign, and zipalign the APK.
 - `all`: Copy and build.

For the `build` step, you will need to create a `tools/creds.js` file that looks like this to package your Cordova app:
```js
module.exports = {
    store: "full path to your .keystore file",
    name: "your key name",
    pass: "your store password",
    jarsigner: "full path to your jarsigner executable, or just 'jarsigner' if it's in your PATH",
    zipalign: "full path to your zipalign executable, or just 'zipalign' if it's in your PATH",
};
``` 

#### FormatImages.js
Generates upscaled spritesheets for optional in-game graphical filters. Requires [ffmpeg](https://ffmpeg.org/) for `hq4x` and [scale2x](https://www.scale2x.it/) for `s4xe`. You may need to update the `s2xpath` variable for `s4xe`.

#### Package.js
Concatenates all source files into one **out.js** file. Calling it with the `min` argument will also minify it.

#### gulpfile.js
Calling `gulp watch` will ensure `Package.js` is executed every time a source file is updated.

#### manual/BuildManualParts.js and manual/BuildManual.js
These will create the instruction manual/strategy guide, with most data pulled straight from the game's code. Run `BuildManualParts.js` to populate the `manual/parts` folder with relevant metadata needed to generate the guide, and run `BuildManual.js` to populate the `manual/out` folder with the `manual.html` file and relevant images in the `manual/out/assets` folder.

All enemies, crops, fixtures and equipment are pulled from the game code. The instruction manual is hard-coded in `manual/parts/template.html`. Much of Calsotte's buffs and the Locations are hard-coded in the `BuildManual.js` file, as are the names of specific achievements and enemies for the purposes of skipping some and marking them as spoilers. Pretty much all map/level data is hard-coded.

Running `node BuildManual.js maps` will create the map images used in the guide - this should be done the first time you run this, but won't be needed afterwards unless you change how the maps look.

### Standard Build
Run `node tools/Package.js` to build everything. All standard spritesheets and game datas are pre-built in the the git repository, but if you have made changes, you will need to run the appropriate script described above. Likewise, if you wish to include the filtered sprites, you will need to run `node tools/FormatImages.js`. After building, run `index.html` in your browser to play.

### Android Build
Run `node tools/Cordova.js all` or if you want to do the building manually:

```
node tools/Cordova.js copy
cd cordova
cordova build android --release
cd platforms/android/app/build/outputs/apk/release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore [yourKeyStore] app-release-unsigned.apk [yourKey]
zipalign -v 4 app-release-unsigned.apk Uprooted.apk
```

If you want to make a version for other Cordova platforms like iOS or something, check out Cordova's documentation for how to add new platforms to a project. There is little custom Cordova code, so it is unlikely that anything in the existing codebase is Android specific.

### Electron Build
Complete all the Standard Build steps above.
**Dev Build:** `npm start`
**Package Only:** `npm pack`
**Package for Distribution:** `npm run dist`

## want to make changes?
The game isn't even done yet hold your horses yo.

## additional assets
Pretty much all sound effects are taken from [512 Sound Effects (8-Bit Style)](https://opengameart.org/content/512-sound-effects-8-bit-style) by [Juhani Junkala](https://juhanijunkala.com/) and are licensed under the [CC 1.0 Universal License](https://creativecommons.org/publicdomain/zero/1.0/).