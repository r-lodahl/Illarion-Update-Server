'use strict'

require('make-promises-safe')
const filesystem = require('fs');
const windows1251 = require('windows-1251');
const glob = require('glob');
const exec = require('child_process').exec;

var gitVersion

function execute(command, callback) {
	exec(command, function(error,stdout,stderr){callback(stdout);});
};

module.exports.onGitWasPushed = async function() {
	execute("cd raw_maps && git pull", (error, stdout, stderr) => {
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
		
		child_process.execSync(`zip -r maps.zip *`, {
			cwd: "tmp_maps/"
		});
		
		gitVersion = child_process.execSync("git rev-parse --verfiy HEAD")
		filesystem.writeFile("map.version", gitVersion, function(error) {
			if (error) {
				return console.error(error);
			}
		});
	});
}

module.exports.getGitVersion() {
	if (gitVersion === null) {
		var reader = new FileReader();
		reader.onload = function(e) {
			gitVersion = reader.result;
		}
		reader.readAsText(map.version);
	}
	return gitVersion;
}