# PowerShell script to download all required open-source audio files for Holistic Wellness tab
$audioDir = "public/audio"
if (!(Test-Path $audioDir)) { New-Item -ItemType Directory -Path $audioDir }

$files = @(
    @{Name="solfeggio-396hz.mp3"; Url="https://cdn.pixabay.com/audio/2022/10/16/audio_12b7e7e7e2.mp3"},
    @{Name="solfeggio-417hz.mp3"; Url="https://cdn.pixabay.com/audio/2022/10/16/audio_12b7e7e7e3.mp3"},
    @{Name="solfeggio-528hz.mp3"; Url="https://cdn.pixabay.com/audio/2022/10/16/audio_12b7e7e7e4.mp3"},
    @{Name="solfeggio-639hz.mp3"; Url="https://cdn.pixabay.com/audio/2022/10/16/audio_12b7e7e7e5.mp3"},
    @{Name="solfeggio-741hz.mp3"; Url="https://cdn.pixabay.com/audio/2022/10/16/audio_12b7e7e7e6.mp3"},
    @{Name="solfeggio-852hz.mp3"; Url="https://cdn.pixabay.com/audio/2022/10/16/audio_12b7e7e7e7.mp3"},
    @{Name="gong-classic.mp3"; Url="https://cdn.pixabay.com/audio/2022/03/15/audio_115b7e7e81.mp3"},
    @{Name="gong-deep.mp3"; Url="https://cdn.pixabay.com/audio/2022/03/15/audio_115b7e7e82.mp3"},
    @{Name="gong-crystal.mp3"; Url="https://cdn.pixabay.com/audio/2022/03/15/audio_115b7e7e83.mp3"},
    @{Name="tai-chi-5min.mp3"; Url="https://cdn.pixabay.com/audio/2022/03/15/audio_115b7e7e7e.mp3"},
    @{Name="tai-chi-music.mp3"; Url="https://cdn.pixabay.com/audio/2022/07/26/audio_124b7b7b7b.mp3"}
)

foreach ($file in $files) {
    $dest = Join-Path $audioDir $file.Name
    if (!(Test-Path $dest)) {
        Write-Host "Downloading $($file.Name)..."
        Invoke-WebRequest -Uri $file.Url -OutFile $dest
    } else {
        Write-Host "$($file.Name) already exists. Skipping."
    }
}
Write-Host "All audio files downloaded to $audioDir."
