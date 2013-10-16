/*
	使用方法：
		首先实例化this
		var foo = new urls({
			rootUrl : "", //域名
			lsitUrl : "", //列表页地址，相对路径
		})
	
		调用init方法，init返回列表页dom，需要手动调用cheerio API解析DOM.
		foo.init(function(listDom){
			... //解析逻辑
			... //将列表页的每一项的地址存入foo.menuList中，这一项是必须的，因为hasNext方法依赖此变量进行遍历。
			foo.next(); //开始解析，此处是递归调用itemHandle方法，数据具体的处理逻辑需要在itemHandle方法中实现。

		})
		
		foo.itemHandle = function(data){
			...从列表页进入内容页的逻辑，也许进入的是另外一个列表页，但是已经由多对一变成一对一的访问，使用getData方法进行处理即可。
			foo.totalPage++; //增加遍历索引
			foo.next(); //下一个Item
		}

	})

*/

var http = require("http");

 

var urls = function(options,callback){
	var that = this;
	options = options || {};
	this.rootUrl = options.rootUrl.search(/^(http||https):\/\/.*/) == -1 ? (options.rootUrl.search(/\/$/) == -1 ? "http://"+options.rootUrl+"/" : "http://"+options.rootUrl) : options.rootUrl || "";
	this.listUrl = options.listUrl.search(/^\//) != -1 ? options.listUrl.slice(1) : options.listUrl || "";
	this.page = options.startIndex || 1;
	this.listDom = options.listDom || "";
	this.totalPage = 0;
	this.menuList = new Array(); 

}
urls.prototype.init = function(callback){
	this.getData(this.rootUrl + this.listUrl, function(data){
		callback(data);
	})
}

urls.prototype.next = function(){
	var self = this;
	this.hasNext(function() { 
		self.itemHandle();
	})
}

urls.prototype.hasNext = function(callback){
 	if(this.page<this.menuList.length){
 		callback();
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
