module.exports = function(param){

	var Rsync = require('rsync');
	var path = require('path');

	var instance = {
		_settings: Object.assign(param ? param:{}, {
			executable: path.resolve(__dirname,'./bin/rsync.exe'),
			destination: './output',
			source:'public@shelter.mahoro-net.org::karaokevideos',
			exclude:['.git', 'ini/', 'lyrics/', '.gitignore', 'CONTRIBUTING', '/dev', '/cygdrive', '/proc', 'LICENSE', 'README.md'],
			RSYNC_PASSWORD:'musubi',
		}),
		_defaultRsync:function()
		{
			var rsync = new Rsync();
			rsync.env(Object.assign({RSYNC_PASSWORD:this._settings.RSYNC_PASSWORD}, process.env));
			rsync.executable(this._settings.executable)
			rsync.source(this._settings.source)
			rsync.destination(this._settings.destination)
			rsync.exclude(this._settings.exclude)
			return rsync;
		},
		search:function(into,q)
		{
			into = into ? into.toLowerCase() : '';
			q = q ? q.toLowerCase() : '';

			var out = [];
			var rsync = this._defaultRsync()
				.flags('r')
				.set('list-only')
				.output(
					function(data){
						// stdout
						data = data.toString();
						lines = data.split("\n");
						for(i=0; i<lines.length; i++)
						{
							line= lines[i].trim();
							if(line.length>0 && line.match(/[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/))
							{
								line = line.substring(46, line.length)
								lineSearch = line.toLowerCase();
								if((into=='' || lineSearch.search(into)==0) && lineSearch.search(q)>=0)
								{
									out.push(line);
								}
							}
						}
						//out.push(data.toString());
					},
					function(data){
						reject(data.toString());
					}
				)

			return new Promise(
				function (resolve, reject) {
					rsync.execute(function(error, code, cmd){
						resolve(out);
					});
				}
			)
		},
		sync:function()
		{
			var out = [];
			var rsync = this._defaultRsync()
				.source(this._settings.source)
				.flags('ruv')
				.set('delete-during')
				.output(
					function(data){
						// stdout
						data = data.toString();
						lines = data.split("\n");
						for(i=0; i<lines.length; i++)
						{
							line = lines[i].trim();
							if(line.length>0)
							{
								console.log(line);
								out.push(line);
							}
						}
					},
					function(data){
						reject(data.toString());
					}
				)
			return new Promise(
				function (resolve, reject) {
					rsync.execute(function(error, code, cmd){
						resolve(out);
					});
				}
			)
		},
	};
	return instance;
}