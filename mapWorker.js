require('make-promises-safe');
const filesystem = require('fs');
const windows1252 = require('windows-1252');
const glob = require('glob');
const path = require('path');
const child_process = require('child_process');

var mapVersion = null;

module.exports.onGitWasPushed = async function() {
	child_process.execSync("git pull", { cwd: path.join(__dirname, "raw_maps") });
	var fileList = glob.sync(path.join(__dirname,"raw_maps/**/*.txt"));

	filesystem.mkdirSync(path.join(__dirname, "tmp_maps"));
	for (var i=0; i < fileList.length; i += 1) {
		const writePath = path.join(__dirname, "tmp_maps", path.relative(path.join(__dirname, "raw_maps"), fileList[i]));
		child_process.execSync(`mkdir -p "${path.dirname(writePath)}"`);
		filesystem.writeFileSync(writePath, windows1252.decode(filesystem.readFileSync(fileList[i]).toString('binary')), function(error) {
			if (error) {
				return console.error(error);
			}
		});
	}
	
	child_process.execSync("zip -r ../public/maps.zip *", { cwd: path.join(__dirname, "tmp_maps")});
	
	child_process.exec("rm -R tmp_maps", {cwd: __dirname}, (error, stdout, stderror) => {if (error) {console.log(error);}});
	
	var versionBuffer = child_process.execSync("git rev-parse --verfiy -q HEAD", { cwd: path.join(__dirname, "raw_maps")});
	mapVersion = versionBuffer.toString('utf8').split("\n")[1].trim();

	console.log(mapVersion);
	filesystem.writeFile("map.version", mapVersion, function(error) {
		if (error) {
			return console.error(error);
		}
	});
}

module.exports.getVersion = function() {
	if (mapVersion === null) {
		mapVersion = filesystem.readFileSync(path.join(__dirname, "map.version")).toString('utf8').trim();
	}
	return mapVersion;
}
