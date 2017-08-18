const puppeteer = require('puppeteer');

async function getLinks( url,browser, page){
	console.log("current url:"+url)

await page.goto(url, {waitUntil: 'networkidle'});

console.log(page.url()) 
// Extract the results from the page
const links = await page.evaluate(() => {
  const anchors = Array.from(document.querySelectorAll('a'));
  return anchors.map(anchor => anchor.href);
});


//删除javjscripts链接
	for(var i=0; i<links.length; i++) {
		var item = String(links[i]);
		if (item.indexOf("javascript:") !=-1 ){
			removeByValue(links, links[i]);
			i--
			}
		}
	//

	//留下所有jcloud.com
	var mainarray = [];
	for(var i=0; i<links.length; i++) {
		var item = String(links[i]);
		if (item.indexOf("jcloud.com") !=-1 ){
			mainarray.push(item);
			}
		}
	//
	
	//过滤:去重
	var uniquearray = mainarray.uniqueweb()
	//
	
	
	return uniquearray;
}



(async() => {
const browser = await puppeteer.launch();
const page = await browser.newPage();
//未处理容器aftlinks
var aftlinks = await getLinks( "https://www.jcloud.com/",browser, page )
//已处理容器proc
var proc = ["https://www.jcloud.com/"]

for(var i=0; i<proc.length; i++) {
	for(var j=0; j<aftlinks.length; j++){
		if (proc[i] == aftlinks[j]){
			removeByValue(aftlinks, aftlinks[j])
}}}


while(aftlinks.length != 0){
	for(var i=0; i<aftlinks.length; i++) {
		console.log("分界线--------------")
		//选择项
		var procitem = aftlinks[i]
		//选择项推送至已处理容器
		proc.push(procitem)
		//获取选择项的所有链接
		
		//
		
		var branch = await getLinks(procitem,browser, page)
		//链接与已处理容器去重
		deletproc(proc, branch)
		//链接与未处理容器去重
		deletproc(aftlinks, branch)
		//去重后链接加入未处理容器
		for(var k=0; k<branch.length; k++){
			aftlinks.push(branch[k])
		
		}
		//删除选择项
		removeByValue(aftlinks, procitem)
		i--
		console.log("已处理:")
		console.log(proc.length)
		console.log("未处理:")
		console.log(aftlinks.length)
		
	}
}


browser.close();

})();





function deletproc(rearr, delarr){
	for(var i=0; i<rearr.length; i++) {
		for(var j=0; j<delarr.length; j++){
			if (rearr[i] == delarr[j]){
				removeByValue(delarr, delarr[j])
}}}	
}




function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}

Array.prototype.uniqueweb = function(){
 this.sort(); 
 var res = [this[0]];
 for(var i = 1; i < this.length; i++){
  if(this[i] !== res[res.length - 1]){
   res.push(this[i]);
  }
 }
 return res;
}