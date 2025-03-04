import * as vscode from "vscode";
import { execFile, exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

/**
 * Installs FFmpeg based on the user's OS.
 */
function installFFmpeg(callback: () => void) {
  const platform = os.platform();

  vscode.window.showInformationMessage("FFmpeg is missing. Installing...");

  let installCommand = "";

  if (platform === "darwin") {
    installCommand = "brew install ffmpeg";
  } else if (platform === "linux") {
    installCommand = "sudo apt update && sudo apt install -y ffmpeg";
  } else if (platform === "win32") {
    installCommand =
      "winget install -e --id Gyan.FFmpeg || choco install ffmpeg -y";
  } else {
    vscode.window.showErrorMessage(
      "Automatic FFmpeg installation is not supported on this OS. Please install it manually."
    );
    return;
  }

  exec(installCommand, (error, stdout, stderr) => {
    if (error) {
      vscode.window.showErrorMessage(`FFmpeg installation failed: ${stderr}`);
      return;
    }
    vscode.window.showInformationMessage("FFmpeg installed successfully.");
    callback();
  });
}

/**
 * Converts an image or video using FFmpeg.
 */
function convertFile(fileUri: vscode.Uri, format: string) {
  const ffmpegPath = "ffmpeg"; // System-installed FFmpeg

  // Check if FFmpeg is available
  execFile(ffmpegPath, ["-version"], (error) => {
    if (error) {
      installFFmpeg(() => convertFile(fileUri, format)); // Install FFmpeg and retry
      return;
    }

    const inputPath = fileUri.fsPath;
    const ext = path.extname(inputPath).toLowerCase();
    const outputPath = path.join(
      path.dirname(inputPath),
      `${path.basename(inputPath, ext)}.${format}`
    );

    if (!fs.existsSync(inputPath)) {
      vscode.window.showErrorMessage("Selected file does not exist.");
      return;
    }

    let ffmpegArgs: string[] = [];

    if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      // Image conversion
      ffmpegArgs =
        format === "webp"
          ? ["-i", inputPath, "-q:v", "75", outputPath]
          : [
              "-i",
              inputPath,
              "-c:v",
              "libaom-av1",
              "-still-picture",
              "1",
              "-q:v",
              "50",
              outputPath,
            ];
    } else if ([".mp4"].includes(ext)) {
      // Video conversion
      ffmpegArgs =
        format === "webm"
          ? [
              "-i",
              inputPath,
              "-c:v",
              "libvpx-vp9",
              "-b:v",
              "1M",
              "-c:a",
              "libopus",
              outputPath,
            ]
          : [
              "-i",
              inputPath,
              "-c:v",
              "libxvid",
              "-q:v",
              "5",
              "-c:a",
              "aac",
              outputPath,
            ];
    } else {
      vscode.window.showErrorMessage("Unsupported file type.");
      return;
    }

    execFile(ffmpegPath, ffmpegArgs, (error, stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage(`Error converting file: ${stderr}`);
        return;
      }
      vscode.window.showInformationMessage(
        `File converted to ${format}: ${outputPath}`
      );
    });
  });
}

export function activate(context: vscode.ExtensionContext) {
  let convertToWebP = vscode.commands.registerCommand(
    "fileConverter.convertToWebP",
    (fileUri: vscode.Uri) => {
      if (fileUri) {
        convertFile(fileUri, "webp");
      }
    }
  );

  let convertToAvif = vscode.commands.registerCommand(
    "fileConverter.convertToAvif",
    (fileUri: vscode.Uri) => {
      if (fileUri) {
        convertFile(fileUri, "avif");
      }
    }
  );

  let convertToWebM = vscode.commands.registerCommand(
    "fileConverter.convertToWebM",
    (fileUri: vscode.Uri) => {
      if (fileUri) {
        convertFile(fileUri, "webm");
      }
    }
  );

  let convertToAvi = vscode.commands.registerCommand(
    "fileConverter.convertToAvi",
    (fileUri: vscode.Uri) => {
      if (fileUri) {
        convertFile(fileUri, "avi");
      }
    }
  );

  let convertToW = vscode.commands.registerCommand(
    "fileConverter.convertW",
    (fileUri: vscode.Uri) => {
      if (fileUri) {
        convertFolder(fileUri, "webp", "webm");
      }
    }
  );

  let convertToA = vscode.commands.registerCommand(
    "fileConverter.convertA",
    (fileUri: vscode.Uri) => {
      if (fileUri) {
        convertFolder(fileUri, "avif", "avi");
      }
    }
  );

  context.subscriptions.push(
    convertToWebP,
    convertToAvif,
    convertToWebM,
    convertToAvi,
    convertToA,
    convertToW
  );
}

export function deactivate() {}

function convertFolder(
  folderUri: vscode.Uri,
  imageFormat: string,
  videoFormat: string
) {
  const folderPath = folderUri.fsPath;

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      vscode.window.showErrorMessage(`Error reading folder: ${err.message}`);
      return;
    }

    const supportedImages = [".png", ".jpg", ".jpeg"];
    const supportedVideos = [".mp4", ".mov", ".avi", ".mkv"];

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const ext = path.extname(file).toLowerCase();

      if (supportedImages.includes(ext)) {
        convertFile(vscode.Uri.file(filePath), imageFormat); // Convert images to WebP
      } else if (supportedVideos.includes(ext)) {
        convertFile(vscode.Uri.file(filePath), videoFormat); // Convert videos to WebM
      }
    });

    vscode.window.showInformationMessage(
      `Conversion completed for folder: ${folderPath}`
    );
  });
}
