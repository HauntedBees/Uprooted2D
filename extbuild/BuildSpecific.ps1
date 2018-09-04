param ([string]$name="sheet.png")

$rootpath = Resolve-Path ..;
$ffmpegpath = "C:\ffmpeg\bin\ffmpeg.exe";
$scalexpath = "C:\scale2x\scalex.exe";

Function ProcessFile($name) {
    $fullPath = "$rootpath\extbuild\rawimg\$name";
	Write-Host "It's $fullPath";
    $fullOutPath = "$rootpath\img$type\$name";
    #New-Item -ItemType Directory -Force -Path $fullOutPath;
    Get-Item $fullPath -Filter *.png |
    ForEach-Object {
        $fullname = $_.FullName; $name = $_.Name;
		
        Write-Host "s4x $name";
		$s4xpath = "$rootpath\imgs4x\$name";
		& "$scalexpath" -k 4 $fullname $s4xpath;
		
        Write-Host "hq4x $name";
		$hq4xpath = "$rootpath\imghq4x\$name";
		& "$ffmpegpath" -y -i $fullname -vf "hqx=4" $hq4xpath;
		
        Write-Host "reg $name";
		$regpath = "$rootpath\img\$name";
		& "$ffmpegpath" -y -i $fullname -vf "scale=iw*4:ih*4" -sws_flags neighbor $regpath;
    }
}
ProcessFile $name;