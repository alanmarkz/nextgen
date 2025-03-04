# nextgen README

This is a package that converts images and videos to next-gen formats for optimized quality and massive reduction in size.

## Installation

You can install the extension via the [VS Code Extensions Marketplace](https://marketplace.visualstudio.com/items?itemName=alanmarkz.nextgen).

![Demo](https://raw.githubusercontent.com/alanmarkz/nextgen/refs/heads/main/nextgen.gif)

## Usage

Once installed, you can use the extension by right-clicking on a file or folder in the VS Code Explorer and selecting the **"Convert to nextgen"** option from the context menu.

The extension will then convert the selected file(s) to the next-gen format, preserving the original file name and folder structure.

## Supported Formats

The extension currently supports the following formats:

- **WebP** (images)
- **AVIF** (images)
- **WebM** (videos)
- **AVI** (videos)

## Configuration

The extension can be configured to use different conversion settings by modifying the `nextgen.config.js` file.

For example, to set the quality of the converted images to 80, you can modify the `nextgen.config.js` file as follows:

```js
module.exports = {
  quality: 80,
  format: "webp",
};
```

## Troubleshooting

If the extension does not work properly, ensure that **FFmpeg** is installed and accessible via the command line.

### Install FFmpeg:

#### **macOS** (Using Homebrew)

```sh
brew install ffmpeg
```

#### **Linux** (Debian/Ubuntu)

```sh
sudo apt update && sudo apt install ffmpeg -y
```

#### **Windows**

1. Download the latest FFmpeg build from [FFmpeg.org](https://ffmpeg.org/download.html).
2. Extract the files and add the `bin` folder to your system’s **PATH** variable.
3. Restart VS Code and try again.

If you continue experiencing issues, ensure that the **ffmpeg** command works by running:

```sh
ffmpeg -version
```
