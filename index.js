const fetch = require('node-fetch');
const semver = require('semver');
const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');
const spawn = require('child_process').spawn;


async function checkForUpdate(options) {
	if (!options || !options.repo) {
		throw ('no repo specified for update check');
	}

	if (!options || !options.currentVersion) {
		throw ('current app version not specified');
	}

	if (!options || !options.assetMatch || typeof(options.assetMatch.test) !== 'function') {
		throw ('assetMatch not specified or not a regexp');
	}

	options.currentVersion = semver.clean(options.currentVersion);
	if (!semver.valid(options.currentVersion)) {
		throw (`current app version ${options.currentVersion} is not valid semver`);
	}

	const response = await fetch(options.repo);
	const release = await response.json();
	if (release.tag_name && semver.valid(release.tag_name) && release.assets) {
		let version = semver.clean(release.tag_name);
		if (semver.gt(version, options.currentVersion)) {
			release.assets.forEach((asset) => {
				if (options.assetMatch.test(asset.name)) {
					if (this.onUpdateAvailable) {
						this.onUpdateAvailable(version, asset);
					}
				}
			});
		};
	}
	return;
};

async function downloadNewVersion(asset) {
	const downloadedFilePath = `${os.tmpdir()}${path.sep}${asset.name}`;
	const file = fs.createWriteStream(downloadedFilePath);
	const response = await fetch(asset.browser_download_url, {
		method: 'GET',
		headers: {
			'User-Agent': 'github-app-updater'
		}
	});

	response.body.pipe(file);
	file.on('finish', () => {
		file.close(() => {
			if (this.onNewVersionReadyToInstall) {
				this.onNewVersionReadyToInstall(downloadedFilePath);
			}
		});
	});
};

async function executeUpdate(filePath) {
	const subprocess = spawn(filePath, {
		detached: true,
		stdio: 'ignore'
	});
	subprocess.unref();
};

module.exports = {
	checkForUpdate: checkForUpdate,
	downloadNewVersion: downloadNewVersion,
	executeUpdate: executeUpdate,

	//events
	onUpdateAvailable: () => {},
	onNewVersionReadyToInstall: () => {}
};
