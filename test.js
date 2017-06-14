
var rsync = require('./index.js')(); // create instance with default parameters

if(process.argv[2]=='search')
{
	rsync.search('',process.argv[3]).then(function(data){ console.log(data); });
}
else if(process.argv[2]=='search-into')
{
	rsync.search(process.argv[3],process.argv[4]).then(function(data){ console.log(data); });
}
else if(process.argv[2]=='sync')
{
	rsync.sync().then(function(data){ });
}
else
{
	console.log('missing parameters');
	console.log('node ./test.js search Dragon');
	console.log('node ./test.js search-into karas Dragon');
	console.log('node ./test.js sync');
}
