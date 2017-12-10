$out = [System.IO.StreamWriter] "E:\GitHub\CropRPG\js\gamedata\text.js";
$csv = Import-CSV "E:\GitHub\CropRPG\raw_text.csv";
$out.WriteLine(@'
function GetText(key) {
	var lang = (game !== undefined) ? game.language : "en-dm";
    var d = fulltext[key];
    if(d[lang] !== undefined) { return d[lang]; }
    return d["en-us"];
}
function HasText(key) { return fulltext[key] !== undefined; }
var fulltext = {
'@);
$i = 0;
$maxlen = $csv.Length;
ForEach($row in $csv) {
	$key = $row.Key;
	$us = ($row."en-us").Trim().Replace("`"", "\`"");
	$dm = ($row."en-dm").Trim().Replace("`"", "\`"");
	$typ = ($row."type");
	$hasdm = $dm -ne "";
	$i += 1;
	if($hasdm) {
		$out.WriteLine("	`"" + $key + "`": {");
		$out.WriteLine("		`"en-us`": `"$us`", ");
		$out.WriteLine("		`"en-dm`": `"$dm`", ");
		$out.WriteLine("		`"type`": `"$typ`"");
		if($i -eq $maxlen) {
			$out.WriteLine("	}");
		} else {
			$out.WriteLine("	},");
		}
	} else {
		if($i -eq $maxlen) {
			$out.WriteLine("	`"" + $key + "`": { `"en-us`": `"$us`" }");
		} else {
			$out.WriteLine("	`"" + $key + "`": { `"en-us`": `"$us`" }, ");
		}
	}
}
$out.Write("};")
$out.close();