const gau = require('../index.js');

gau.checkForUpdate({
	currentVersion: '1.0.0',
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
