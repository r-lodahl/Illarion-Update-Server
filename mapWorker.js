require('make-promises-safe');
const filesystem = require('fs');
const windows1252 = require('windows-1252');
const glob = require('glob');
const path = require('path');
const child_process = require('child_process');

var mapVersion

module.exports.onGitWasPushed = async function() {
	filesystem.mkdirSync(path.join(__dirname, "raw_maps"));
	child_process.exec("cd raw_maps && git pull", (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: $(error)`);
			return
		}
		
		var fileList = glob.sync(path.join(__dirname,"raw_maps/**/*.txt"));
		
		for (file in fileList) {
			filesystem.writeFileSync(path.join(__dirname, path.basename(file)), windows1252.decode(filesystem.readFileSync(file).toString('binary')), function(error) {
				if (error) {
					return console.error(error);
				}
			});
		}
		
		child_process.execSync(`zip -r public/maps.zip *`, {
			cwd: "tmp_maps/"
		});
		
		filesystem.rmdir(path.join(__dirname, "raw_maps"));
		filesystem.rmdir(path.join(__dirname, "tmp_maps"));
		
		mapVersion = child_process.execSync("git rev-parse --verfiy HEAD")
		filesystem.writeFile("map.version", mapVersion, function(error) {
			if (error) {
				return console.error(error);
			}
		});
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
