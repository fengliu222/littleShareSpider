var urls = require("./bug.js");
var che = require("cheerio");
var fs = require('fs');

var Catch = new urls({
						rootUrl:"http://littleshar.com/",
						listUrl:"board/message/sort/favorite/page/"
			});
			
Catch.next(getSinglePageList);

//处理得到的单页数据。
function getSinglePageList(data){
	var $ = che.load(data);
	var list = $(".pin a[class='cover']");
 	var result = [];
 	 console.log(list.length);
	for(var i=0; i < list.length; i++){
		result.push(list[i].attribs['href']);
	}
 	pageParser(result);
	 
}

var curPageIndex = 0;
function pageParser(res){
	if(curPageIndex < res.length){
		Catch.getData(Catch.rootUrl+res[curPageIndex],function(data){
			 
			var $ = che.load(data);
			var title = $(".message-img h3").html();
			var href = Catch.rootUrl + $(".action a").eq(0)[0].attribs['href'];
 			
 			writeF(title,href);
			curPageIndex++;
			pageParser(res);
		})
	}else{
		curPageIndex=0;
		Catch.page++;
		Catch.next(getSinglePageList);
	}
}

function writeF(title,href){
	 var gs = title + ":\n\n" + href;
	 fs.stat("result.txt", function(err,stats){
							if(stats == undefined){
								 fs.open("result.txt","w",function(){
								 	fs.appendFileSync("result.txt",gs+"\n\n");
								 });

							}else{

								fs.appendFileSync("result.txt",gs+"\n\n");

							}
						})
}
					
