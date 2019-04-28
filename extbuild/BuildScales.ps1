param ([string]$which="s4x")

$rootpath = Resolve-Path ..;
$ffmpegpath = "C:\ffmpeg\bin\ffmpeg.exe";
$scalexpath = "C:\scale2x\scalex.exe";

Function ProcessDir($path, $type) {
    $fullPath = "$rootpath\extbuild\rawimg$path";
    $fullOutPath = "$rootpath\img$type$path";
    New-Item -ItemType Directory -Force -Path $fullOutPath;
    Get-ChildItem $fullPath -Filter *.png |
    ForEach-Object {
        $fullname = $_.FullName; $name = $_.Name;
        Write-Host "Processing $name";
        if($type -eq "s4x") { 
            & "$scalexpath" -k 4 $fullname $fullOutPath\$name;
        } elseif($type -eq "s2x") { # nah
            & "$scalexpath" -k 2 $fullname $fullOutPath\$name;
            & "$ffmpegpath" -y -i $fullOutPath\$name -vf "scale=iw*2:ih*2" -sws_flags neighbor $fullOutPath\$name;
        } elseif($type -eq "hq2x") { # nah
            & "$ffmpegpath" -y -i $fullname -vf "hqx=2,scale=iw*2:ih*2" -sws_flags neighbor $fullOutPath\$name;
        } elseif($type -eq "hq4x") { # requires manual trimming of player combat and combat equipment
            & "$ffmpegpath" -y -i $fullname -vf "hqx=4" $fullOutPath\$name;
        }
    }
}
Write-Host "Processing $which";
ProcessDir "" $which;
ProcessDir "\bgs" $which;
ProcessDir "\end" $which;
ProcessDir "\covers" $which;
ProcessDir "\fg" $which;
ProcessDir "\maps" $which;
ProcessDir "\shopblinks" $which;
ProcessDir "\shops" $which;
ProcessDir "\title" $which;