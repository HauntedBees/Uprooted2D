# Farming Fantasy
## wut
A turn-based farming RPG.
## disclaimer
The codebase currently has lots of dummy text in it. If you don't want to see potty words, maybe don't look at this yet.
## license
This game's source code is licensed with the [GNU Affero General Public License](https://www.gnu.org/licenses/agpl-3.0.en.html). All art assets are licensed with the [CC BY-SA 4.0 License](https://creativecommons.org/licenses/by-sa/4.0/legalcode).
## why
Sometimes I make choices. They aren't always good ones.
## building
### requirements
[UglifyJS](https://www.npmjs.com/package/uglify-js) is used to compile all the necessary JS files into one big baby (and also minify them). [Gulp](https://www.npmjs.com/package/gulp) is used to automate this building and to rebuild the **collisions.js** file. All of the raw art assets are stored in [Paint.NET](https://www.getpaint.net/)'s format. PowerShell is used to convert several of the **.ods** files into the appropriate **.js** files; these scripts also use [LibreOffice](https://www.libreoffice.org/) to convert the **.ods** files into **.csv** files that PowerShell can work with. [jQuery](https://jquery.com/) is used to build the guide, and [Bootstrap](https://getbootstrap.com/) is used to style it.

If you don't want to or cannot install UglifyJS, you can just manually include all the necessary JS files in **index.html** or merge them all into a single file with some other tool.

If you don't want to or cannot install Gulp, you can probably build the collisions file some other way - it basically just reads the images in the **collision** directory and makes arrays out of them - ``true`` for red pixels, ``false`` for transparent pixels.

If you don't want to or cannot install Paint.NET, you can edit the image files in any old image editor. They're images.

If you don't want to or cannot install LibreOffice, you can save the **.ods** files as **.csv** files manually.

If you don't want to or cannot install PowerShell, you can just edit the various **.js** files manually.

### images
For pretty much every file in the **pdn** directory, just copy the main layer(s) into a new file, scale by 400% (using _nearest neighbor_ scaling) and then save as a PNG with the same name in the **img** directory (a few files have different names in the **img** directory than their **pdn** counterparts). For map files, copy the red/transparent layer into a new file, scale it to 1/16 its original size, then save that as a PNG with the same name in the **collision** directory.
### worldmap/collisions.js
Run ``gulp buildcollisions`` any time a file in the **collision** directory is added/changed/removed. Currently the output file needs to have the last comma and the closing ``};`` manually removed and added respectively.
### .ods files
You may need to update the path to LibreOffice's ``soffice.exe`` in these scripts.

Run ``BuildTextNew.ps1`` to build ``gamedata/text.js`` and ``gamedata/cutscenes.js`` from ``Details_Text.ods`` and ``Details_Cutscenes.ods`` respectively.

Run ``BuildItemDetails.ps1`` to build ``gamedata\veggies.js``, ``gamedata\equipment.js``, ``gamedata\fixtures.js``, and ``gamedata\enemies.js`` from ``Details_Crops.ods``, ``Details_Equipment.ods``, ``Details_Fixtures.ods``, and ``Details_Enemies.ods`` respectively.

Run ``BuildEnemyAttackJSON.ps1`` to merge all **.json** files in ``extbuild\enemyjson\`` into ``gamedata\enemy_patterns.js``. The **.json** files are created with a modified version of [Kelly](https://github.com/HauntedBees/Kevin) which will be checked in eventually.
### main game
Run ``uglify.cmd`` or just call the **uglifyjs** command in the file.
## want to make changes?
The game isn't even done yet hold your horses yo.