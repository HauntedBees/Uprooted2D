$rootpath = Resolve-Path ..;
$results = @();
Get-ChildItem "$rootpath\extbuild\enemyjson" -Filter *.json |
ForEach-Object {
	$content = (Get-Content $_.FullName) -replace "\s+", " ";
	$name = $_.Name.split(".")[0];
	$results += "`"$name`": $content";
}
$out = [System.IO.StreamWriter] "$rootpath\js\gamedata\enemy_patterns.js";
$out.WriteLine("var enemyPatterns = {");
$out.WriteLine(($results -join ",`n"));
$out.Write("};");
$out.Close();