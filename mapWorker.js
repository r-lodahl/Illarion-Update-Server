require('make-promises-safe');
const filesystem = require('fs');
const windows1252 = require('windows-1252');
const glob = require('glob');
const exec = require('child_process').exec;

var mapVersion

module.exports.onGitWasPushed = async function() {
	child_process.exec("cd raw_maps && git pull", (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: $(error)`);
			return
		}
		
		var fileList = glob.sync("raw_maps/**/*.txt"); 
		
		var reader = new FileReader();
		for (file in fileList) {
			reader.onload = function(e) {
				filesystem.writeFile("tmp_maps/", windows1252.decode(reader.result), function(error) {
					if (error) {
						return console.error(error);
					}
				});
			};
			reader.readAsBinaryString(file);
		}
		
		child_process.execSync(`zip -r public/maps.zip *`, {
			cwd: "tmp_maps/"
		});
		
		child_process.exec("rm -r tmp_maps", (error, stdout, stderr) => {
			if (error) {
				console.error(error)
			}
		});
		
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
