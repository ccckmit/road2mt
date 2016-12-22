let fs = require("fs");
let co = require("co");
let request = require("co-request");
let mt = require("./mt");
let c2e = require("./c2e");

// var body='<p><strong>注意：</strong>這份文件是用Markdown寫的，你可以<a href="https://github.com/othree/markdown-syntax-zhtw/blob/master/syntax.md">看看它的原始檔</a> 。</p><hr><h2 id="overview">概述</h2>';
// var body = "<h1>May 上帝保佑你</h1><p>可愛女孩</p>"
var body = fs.readFileSync("./test/Markdown.html", "utf8");
// console.log("body=", body);
var eHtml = mt.mtHtml(body, c2e);
 console.log("eHtml=", eHtml);
/*
co(function* () {
  // You can also pass options object, see http://github.com/mikeal/request docs
//  let result = yield request("http://markdown.tw/");
  let body = result.body;
//  console.log("Body: ", body); 
  var eHtml = mt.mtHtml(body, c2e);
  console.log(eHtml); 
}).catch(function (err) {
  console.error(err);
});
*/
/*

var http = require('http');

http.get("http://markdown.tw/", function(res) {
  console.log("Got response: " + res.statusCode);
  res.on('data', function (html) {
    console.log(html);
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
*/