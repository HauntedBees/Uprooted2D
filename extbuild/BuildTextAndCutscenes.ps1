param ([string]$which="TS")

$rootpath = Resolve-Path ..;
if($which.Contains("T")) {
	Write-Host "Converting Details_Text.ods to text.js";
	& "C:\Program Files\LibreOffice\program\scalc.exe" --headless --convert-to csv:"Text - txt - csv (StarCalc)":"44,34,0,,,,true" --outdir ".\temp" "Details_Text.ods" | Out-Null;
	$csv = Import-CSV ".\temp\Details_Text.csv";

	$out = [System.IO.StreamWriter] "$rootpath\js\gamedata\text.js";
	$out.WriteLine(@'
const fulltext = {
'@);
	$i = 0;
	$maxlen = $csv.Length;
	ForEach($row in $csv) {
		$key = $row.Key;
		if($key -eq "") { continue; }
		if($key -eq "*") { $out.WriteLine("	// " + ($row."en-us")); continue; }
		$us = $row."en-us";
		$usSFW = $row."en-us-sfw";
		if(-not $row."noTrim") {
			$us = $us.TrimEnd();
			$usSFW = $usSFW.TrimEnd();
		}
		$us = $us.Replace("`"", "\`"");
		$usSFW = $usSFW.Replace("`"", "\`"");
		$typ = ($row."type");
		$i += 1;
		$out.WriteLine("	`"" + $key + "`": {");
		$out.WriteLine("		`"en-us`": `"$us`", ");
		if($usSFW -ne "") { $out.WriteLine("		`"en-us-sfw`": `"$usSFW`", "); }
		if($row."profile") {
			$profile = $row."profile";
			$out.WriteLine("		`"profile`": `"$profile`",");
		}	
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
	& "C:\Program Files\LibreOffice\program\scalc.exe" --headless --convert-to csv --outdir ".\temp" "Details_Cutscenes.ods" | Out-Null;
	$csv = Import-CSV ".\temp\Details_Cutscenes.csv";

	$out = [System.IO.StreamWriter] "$rootpath\js\gamedata\cutscenes.js";
	$out.WriteLine(@'
const scripts = {
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