var urls = require("./bug.js");
var che = require("cheerio");
var fs = require('fs');

var Catch = new urls({
	rootUrl: "http://www.xunl.us/",
	listUrl: "tf"
});

Catch.itemHandle = function() {
	Catch.getData(Catch.menuList[Catch.totalPage], function(data) {
		console.log("第"+ (Catch.totalPage+1) +"页");
		var $ = che.load(data);
		if($("a[target='kuaichuan']")[0]){
			var target = $("a[target='kuaichuan']")[0].attribs.href;
			Catch.getData(target, function(res){
				var $ = che.load(res);
				var finalTarget = $('.player a')[0].attribs.href;
				writeFile(finalTarget, "res.txt");
				Catch.totalPage++;
				Catch.next();
 
			})
		}else{
			Catch.totalPage++;
			Catch.next();
		}
	})
}

Catch.init(function(data){
	var $ = che.load(data);
	var listTemp = $(".message1 a");
	listTemp.each(function(index, el) {
		Catch.menuList.push(Catch.rootUrl + el.attribs.href + " ");
	})
	console.log(Catch.menuList.length)
	Catch.next(); 
});




function writeFile(content, fileName) {
	var gs = content + ":\n\n";
	fs.stat(fileName, function(err, stats) {
		if (stats == undefined) {
			fs.open(fileName, "w", function() {
				fs.appendFileSync(fileName, gs + "\n\n");
			});

		} else {

			fs.appendFileSync(fileName, gs + "\n\n");

		}
	})
}