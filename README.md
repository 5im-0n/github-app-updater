# GitHub App Updater

A node module that helps you autoupdating your apps if you use GitHub releases.

## Usage
Release your app to GitHub releases using a semver tag name for your version.  
This module will go check on GitHub if a new version is available, download it to a temp directory, and start the downloaded executable.

`npm i github-app-updater`

```javascript
const gau = require('github-app-updater');

gau.checkForUpdate({
	currentVersion: require('./package.json').version,
	repo: 'https://api.github.com/repos/S2-/gitlit/releases/latest',
	assetMatch: /.+setup.+exe/i
});

gau.onUpdateAvailable = (version, asset) => {
	console.log(`new version ${version} available!`);
	gau.downloadNewVersion(asset);
};

gau.onNewVersionReadyToInstall = (file) => {
	console.log(`ready to install ${file}`);
	gau.executeUpdate(file);
};
```

### Methods

#### `checkForUpdate(options)`

Starts an update check. This connects to GitHub and looks for new releases.

- `options <object>`
  - `currentVersion <string>` the current version the app of the running app.
  - `repo <string>` the github api url for the latest version. For example `https://api.github.com/repos/S2-/gitlit/releases/latest`
  - `assetMatch <RegExp>` a regular expression that matches the installer asset. For example to match `gitlit-Setup-2.0.5.exe` it could be `/.+setup.+exe/i`

#### `downloadNewVersion(asset)`

Downloads the new release from GitHub to a temp folder.

- `asset <object>` the asset object received as parameter on the `onUpdateAvailable` event.

#### `executeUpdate(file)`

Executes the downloaded installer for the new version.

- `file <object>` the `file` object received as parameter on the `onNewVersionReadyToInstall` event`.

### Events

#### `onUpdateAvailable(version, asset)`

Callback that is invoked when a new version of the app is available on GitHub.

- `version <string>` the new remote version that was found.
- `asset <object>` the GitHub asset object for the release.

#### `onNewVersionReadyToInstall(file)`

Callback that is invoked when the new version is downloaded and ready to be installed.

- `file <string>` path of the installer that was downloaded`
