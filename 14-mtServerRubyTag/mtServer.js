var koa     = require('koa');
var serve   = require('koa-static');
var route   = require('koa-route');
var request = require("co-request");
var mt      = require('./lib/mt');

var response=function(self, code, msg, type) {
	var res = self.response;
  res.status = code;
  res.set({'Content-Length':''+msg.length,'Content-Type':'text/'+type});
  res.body = msg;
  if (code !== 200) console.log('response error : ', code, msg);
}

var translate=function *(op) {
	try {
    var s2t = (op === "e2c")?mt.e2c:mt.c2e;
    console.log("s2t=%s", s2t);
		var url  = this.query.url;
    console.log("url=%s", url);
    var page = yield request(url);
    var body = page.body;
    console.log("body=%s", body.substring(500, 1000));
    if (this.is('html')) {
      var html = mt.mtHtml(body, s2t);
      response(this, 200, html, 'html');
    } else if (this.is('text')){
      var text = mt.mtHtml(body, s2t);
      response(this, 200, text, 'html');
    } else {
      response(this, 404, 'error:cannot translate page in type : '+this.type);
    }
	} catch (e) {
		response(this, 403, e.stack);
	}
}

var app = koa();

app.use(serve('dictionary'));
app.use(serve('web'));
app.use(route.get('/mt/:op', translate));

if (!module.parent) app.listen(3000);
console.log('listening on port 3000');
