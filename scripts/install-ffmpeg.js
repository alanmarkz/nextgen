const { exec } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

const ffmpegPath = path.join(__dirname, "../bin/ffmpeg");

function isFFmpegInstalled(callback) {
  exec("ffmpeg -version", (error, stdout) => {
    callback(!error);
  });
}

function installFFmpeg() {
  const platform = os.platform();
  let ffmpegUrl = "";

  if (platform === "win32") {
    ffmpegUrl =
      "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip";
  } else if (platform === "darwin") {
    ffmpegUrl = "https://evermeet.cx/ffmpeg/getrelease";
  } else {
    ffmpegUrl =
      "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz";
  }

  console.log("Downloading FFmpeg...");
  exec(
    `curl -L ${ffmpegUrl} -o ffmpeg.zip && unzip ffmpeg.zip -d bin && rm ffmpeg.zip`,
    (error) => {
      if (error) {
        console.error("FFmpeg download failed:", error);
      } else {
        console.log("FFmpeg installed successfully.");
      }
    }
  );
}

isFFmpegInstalled((installed) => {
  if (!installed) {
    installFFmpeg();
  } else {
    console.log("FFmpeg is already installed.");
  }
});
