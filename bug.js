/**
 * @author moejser
 * 抓取器适用于有一个列表页的站点，通过获取列表页中的A标签属性来批量抓取信息。
 * urls函数只提供数据抓取的工作，不应该与数据处理函数耦合。
 */

var http = require("http");

 

var urls = function(options,callback){
	var that = this;
	options = options || {};
	this.rootUrl = options.rootUrl.search(/^(http||https):\/\/.*/) == -1 ? (options.rootUrl.search(/\/$/) == -1 ? "http://"+options.rootUrl+"/" : "http://"+options.rootUrl) : options.rootUrl || "";
	this.listUrl = options.listUrl.search(/^\//) != -1 ? options.listUrl.slice(1) : options.listUrl || "";
	this.page = options.startIndex || 1;
	this.listDom = options.listDom || "";
	this.totalPage = "";
	this.menuList = new Array(); 

}

urls.prototype.next = function(callback){
 	callback = callback || {};
 	console.log("已经下载到第"+this.page+"页");
	if(this.hasNext){
		this.getData(this.rootUrl+this.listUrl+this.page,function(data){
			 
			callback(data);
		})
	}else{
		console.log("已经全部下载完毕");
		return;
	}	 
	
	
}
urls.prototype.hasNext = function(callback){
 	if(this.page<51){
 		return true;
 	}else{
 		return false;
 	}
}


urls.prototype.getData =function(url,callback){
	if(!url){
		console.log("Error:URL有误。");
		return ;
	}
 
	callback = callback || {};
	http.get(url,function(res){
		var size = 0;
		var content = [];
		
		res.on('data',function(data){
			size += data.length;
			content.push(data);
		});
		res.on('end',function(){
			var data = Buffer.concat(content,size);
			data = data.toString();
			callback(data);
		})
	}).on('error',function(e){
		console.log("Error: "+e.message);
	});	
	 
}

module.exports = urls;
