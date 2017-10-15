$out = [System.IO.StreamWriter] "YOUR_PATH\js\gamedata\text.js";
$csv = Import-CSV "YOUR_PATH\raw_text.csv";
$out.WriteLine(@'
function GetText(key) {
    var d = fulltext[key];
    if(d[game.language] !== undefined) { return d[game.language]; }
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
	$hasdm = $dm -ne "";
	$i += 1;
	if($hasdm) {
		$out.WriteLine("	`"" + $key + "`": {");
		$out.WriteLine("		`"en-us`": `"$us`", ");
		$out.WriteLine("		`"en-dm`": `"$dm`"");
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