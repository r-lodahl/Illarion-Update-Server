require('make-promises-safe');
const filesystem = require('fs');
const windows1252 = require('windows-1252');
const glob = require('glob');
const path = require('path');
const child_process = require('child_process');

var mapVersion

module.exports.onGitWasPushed = async function() {
	child_process.execSync("git pull", { cwd: path.join(__dirname, "raw_maps") });
	var fileList = glob.sync(path.join(__dirname,"raw_maps/**/*.txt"));

	filesystem.mkdirSync(path.join(__dirname, "tmp_maps"));
	for (var i=0; i < fileList.length; i += 1) {
		filesystem.writeFileSync(path.join(__dirname, "tmp_maps", path.basename(fileList[i])), windows1252.decode(filesystem.readFileSync(fileList[i]).toString('binary')), function(error) {
			if (error) {
				return console.error(error);
			}
		});
	}
		
	child_process.execSync("zip -r ../public/maps.zip", { cwd: path.join(__dirname, "tmp_maps")});
		
	filesystem.rmdir(path.join(__dirname, "tmp_maps"));
		
	mapVersion = child_process.execSync("git rev-parse --verfiy HEAD", { cwd: path.join(__dirname, "raw_maps")});
	filesystem.writeFile("map.version", mapVersion, function(error) {
		if (error) {
			return console.error(error);
		}
	});
}

module.exports.getVersion = function() {
	if (mapVersion === null) {
		var reader = new FileReader();
		reader.onload = function(e) {
			mapVersion = reader.result;
		}
		reader.readAsText(map.version);
	}
	return mapVersion;
}
