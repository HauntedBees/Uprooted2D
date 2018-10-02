param ([string]$which="S")

$rootpath = Resolve-Path ..;
if($which.Contains("S")) {
    Write-Host "Converting Details_BigSprites.ods and Details_SmallSprites to spritedata.js";
    Write-Host "Starting Details_BigSprites.ods Conversion";
    & "C:\Program Files (x86)\LibreOffice 5\program\scalc.exe" --headless --convert-to csv:"Text - txt - csv (StarCalc)":"44,34,0,,,,true" --outdir ".\temp" "Details_BigSprites.ods" | Out-Null;
	$csv = Import-CSV ".\temp\Details_BigSprites.csv" -Header 0, 1, 2, 3, 4, 5, 6, 7, 8;
    $out = [System.IO.StreamWriter] "$rootpath\js\gamedata\spritedata.js";
    $aliases = @{};
    $row = 10;
    while($true) {
        if($csv[$row].0 -eq $null) { break; }
        $key = $csv[$row].1;
        if($aliases[$key] -eq $null) {
            $aliases[$key] = @($csv[$row].0);
        } else {
            $aliases[$key] += $csv[$row].0;
        }
        $row += 1;
    }
    $out.WriteLine("const sprites = {");
    for($y = 0; $y -lt 8; $y++) {
        for($x = 0; $x -lt 9; $x++) {
            $val = $csv[$y].$x;
            $out.WriteLine("    `"$val`": [$x, $y, true],");
            if($aliases[$val] -ne $null) {
                $alarr = $aliases[$val];
                for($i = 0; $i -lt $alarr.length; $i++) {
                    $alias = $alarr[$i];
                    $out.WriteLine("    `"$alias`": [$x, $y, true],");
                }
            }
        }
    }
    
    Write-Host "Starting Details_SmallSprites.ods Conversion";
    & "C:\Program Files (x86)\LibreOffice 5\program\scalc.exe" --headless --convert-to csv:"Text - txt - csv (StarCalc)":"44,34,0,,,,true" --outdir ".\temp" "Details_SmallSprites.ods" | Out-Null;
	$csv = Import-CSV ".\temp\Details_SmallSprites.csv" -Header 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30;
    $aliases = @{}; $addFives = @{};
    $row = 33;
    while($true) {
        if($csv[$row].0 -eq $null) { break; }
        $key = $csv[$row].1;
        if($aliases[$key] -eq $null) {
            $aliases[$key] = @($csv[$row].0);
        } else {
            $aliases[$key] += $csv[$row].0;
        }
        if($csv[$row].2 -ne $null) {
            $addFives[$csv[$row].3] = $csv[$row].2;
        }
        $row += 1;
    }
    for($y = 0; $y -lt 31; $y++) {
        for($x = 0; $x -lt 31; $x++) {
            $val = $csv[$y].$x;
            if($val -eq "") { continue; }
            $out.WriteLine("    `"$val`": [$x, $y],");
            if($aliases[$val] -ne $null) {
                $alarr = $aliases[$val];
                for($i = 0; $i -lt $alarr.length; $i++) {
                    $alias = $alarr[$i];
                    $out.WriteLine("    `"$alias`": [$x, $y],");
                }
            }
            if($addFives[$val] -ne $null) {
                $alias = $addFives[$val];
                $xPointFive = $x + 0.5;
                $out.WriteLine("    `"$alias`": [$xPointFive, $y],");
            }
        }
    }
    $out.WriteLine("    `"tooLazyToWriteCodeToTrimTheLastCommaRightNow`": []");
	$out.Write("};")
	$out.close();
}
Remove-Item .\temp -recurse;