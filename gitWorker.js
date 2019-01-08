'use strict'

require('make-promises-safe')
const filesystem = require('fs');
const windows1251 = require('windows-1251');
const glob = require('glob');
const exec = require('child_process').exec;

var gitVersion

module.exports.onGitWasPushed = async function() {
	child_process.exec("cd raw_maps && git pull", (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: $(error)`);
			return
		}
		
		var fileList = glob.sync("raw_maps/**/*.txt"); 
		
		var reader = new FileReader();
		for file in fileList {
			reader.onload = function(e) {
				filesystem.writeFile("tmp_maps/", windows1251.decode(reader.result), function(error) {
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
		
		gitVersion = child_process.execSync("git rev-parse --verfiy HEAD")
		filesystem.writeFile("map.version", gitVersion, function(error) {
			if (error) {
				return console.error(error);
			}
		});
	});
}

module.exports.getVersion() {
	if (gitVersion === null) {
		var reader = new FileReader();
		reader.onload = function(e) {
			gitVersion = reader.result;
		}
		reader.readAsText(map.version);
	}
	return gitVersion;
}