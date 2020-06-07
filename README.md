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
