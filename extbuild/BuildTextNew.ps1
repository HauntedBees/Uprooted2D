param ([string]$which="TS")


$rootpath = Resolve-Path ..;
if($which.Contains("T")) {
	Write-Host "Converting Details_Text.ods to text.js";
	& "C:\Program Files (x86)\LibreOffice 5\program\scalc.exe" --headless --convert-to csv:"Text - txt - csv (StarCalc)":"44,34,0,,,,true" --outdir ".\temp" "Details_Text.ods" | Out-Null;
	$csv = Import-CSV ".\temp\Details_Text.csv";

	$out = [System.IO.StreamWriter] "$rootpath\js\gamedata\text.js";
	$out.WriteLine(@'
function GetText(key) {
	try {
		var lang = (game !== undefined) ? game.language : "en-dm";
		var d = fulltext[key];
		if(d[lang] !== undefined) { return d[lang]; }
		return d["en-us"];
	} catch(e) {
		console.log("Couldn't find key: " + key);
		return "fucko"; //throw e;
	}
}
function HandleArticles(mainStr, subject) { // this is English-language specific; oops!
	if(subject === undefined || subject === "" || mainStr.indexOf("{an}") < 0) { return mainStr; }
	if(subject[subject.length - 1] === "s") {
		return mainStr.replace(/\{an\}/g, "");
	} else if("aeiou".indexOf(subject[0].toLowerCase()) >= 0) {
		return mainStr.replace(/\{an\}/g, " an");
	} else {
		return mainStr.replace(/\{an\}/g, " a");
	}
}
function HandlePlurals(mainStr, subject) { // this is English-language specific; oops!
	if(subject === undefined || mainStr.indexOf("{s}") < 0) { return mainStr; }
	if(subject === 1) {
		return mainStr.replace(/\{s\}/g, "");
	} else {
		return mainStr.replace(/\{s\}/g, "s");
	}
}
function HasText(key) { return fulltext[key] !== undefined; }
var fulltext = {
'@);
	$i = 0;
	$maxlen = $csv.Length;
	ForEach($row in $csv) {
		$key = $row.Key;
		if($key -eq "") { continue; }
		if($key -eq "*") { $out.WriteLine("	// " + ($row."en-dm")); continue; }
		$us = ($row."en-us").TrimEnd().Replace("`"", "\`"");
		$dm = ($row."en-dm").TrimEnd().Replace("`"", "\`"");
		$typ = ($row."type");
		$hasdm = $dm -ne "";
		$i += 1;
		$out.WriteLine("	`"" + $key + "`": {");
		$out.WriteLine("		`"en-us`": `"$us`", ");
		if($dm -ne "") { $out.WriteLine("		`"en-dm`": `"$dm`", "); }	
		$out.WriteLine("		`"type`": `"$typ`"");
		if($i -eq $maxlen) {
			$out.WriteLine("	}");
		} else {
			$out.WriteLine("	},");
		}
	}
	$out.Write("};")
	$out.close();
	Write-Host "Converted $i lines";
}

if($which.Contains("S")) {
	Write-Host "Converting Details_Cutscenes.ods to cutscenes.js";
	& "C:\Program Files (x86)\LibreOffice 5\program\soffice.exe" --headless --convert-to csv --outdir ".\temp" "Details_Cutscenes.ods" | Out-Null;
	$csv = Import-CSV ".\temp\Details_Cutscenes.csv";

	$out = [System.IO.StreamWriter] "$rootpath\js\gamedata\cutscenes.js";
	$out.WriteLine(@'
var scripts = {
'@);
	$i = 0;
	$maxlen = $csv.Length;
	ForEach($row in $csv) {
		$key = $row.Key;
		if($key -eq "") { continue; }
		if($key -eq "*") { $out.WriteLine("	// " + ($row."Action")); continue; }
		$action = ($row."Action").Trim().Replace("`"", "\`"");
		$i += 1;
		if($i -eq $maxlen) {
			$out.WriteLine("	`"$key`": `"$action`"");
		} else {
			$out.WriteLine("	`"$key`": `"$action`",");
		}
	}
	$out.Write("};")
	$out.close();
	Write-Host "Converted $i cutscene scripts";
}

Remove-Item .\temp -recurse;