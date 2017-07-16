# Farming Fantasy
## wut
A turn-based farming RPG.
## disclaimer
The codebase currently has lots of dummy text in it. If you don't want to see potty words, maybe don't look at this yet.
## license
This game's source code is licensed with the [GNU General Public License](https://www.gnu.org/licenses/gpl-3.0.en.html). All art assets are licensed with the [CC BY-SA 4.0 License](https://creativecommons.org/licenses/by-sa/4.0/legalcode).
## why
Sometimes I make choices. They aren't always good ones.
## building
### requirements
[UglifyJS](https://www.npmjs.com/package/uglify-js) is used to compile all the necessary JS files into one big baby (and also minify them). [Gulp](https://www.npmjs.com/package/gulp) is used to automate this building and to rebuild the **collisions.js** file. All of the raw art assets are stored in [Paint.NET](https://www.getpaint.net/)'s format. PowerShell is used to convert the **raw_text.csv** file into **text.js**.

If you don't want to or cannot install UglifyJS, you can just manually include all the necessary JS files in **index.html** or merge them all into a single file with some other tool.

If you don't want to or cannot install Gulp, you can probably build the collisions file some other way - it basically just reads the images in the **collision** directory and makes arrays out of them - ``true`` for red pixels, ``false`` for transparent pixels.

If you don't want to or cannot install Paint.NET, you can edit the image files in any old image editor. They're images.

If you don't want to or cannot install PowerShell, you can just edit **text.js** on its own. The format's pretty straightforward.

### images
For pretty much every file in the **pdn** directory, just copy the main layer into a new file, scale it by 400% (using _nearest neighbor_ scaling) and then save it as a PNG with the same name in the **img** directory. For map files, copy the red/transparent layer into a new file, scale it to 1/16 its original size, then save that as a PNG with the same name in the **collision** directory.
### worldmap/collisions.js
Run ``gulp buildcollisions`` any time a file in the **collision** directory is added/changed/removed. Currently the output file needs to have the last comma and the closing ``};`` manually removed and added respectively.
### gamedata/text.js
Run ``BuildTextJS.ps1`` whenever **raw_text.csv** is updated, after editing the ps1 file to point to the proper paths for the ``$out`` and ``$csv`` variables.
### main game
run ``uglify.cmd`` or just call the **uglifyjs** command in the file.
## want to make changes?
The game isn't even done yet hold your horses yo.
