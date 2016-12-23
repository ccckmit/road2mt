var c2e = require("../dictionary/c2e.json");
var e2c = require("../dictionary/e2c.json");
var MT = module.exports = {
  c2e:c2e,
  e2c:e2c,
}

MT.wordRegex = /(&?[\w']+;?)|([\u4E00-\u9FFF]+)|([\n\r]+)|(\S)/gmi;
MT.suffixList = [
  "=", "d==%cd", "s==%cs", "es==%ces", "ed==%ced", "ly==%cly", "al==%cal", 
  "er=e=%cer", "er==%cer", "'s==%c's", "ies=y=%cies", "n't==%cn't",
  "ion==%cion", "ion=e=%cion",
  "ing==%cing", "ing=e=%ceing", "est=e=%cest", "able==%cable" ];

MT.clex = function(text, c2e) {
//  console.log("clex:text=%s", text);
  var array = [];
  for (var i=0; i<text.length; ) {
    for (var len=4; len>=1; len--) {
      var c = text.substr(i, len);
//      console.log("c=%s", c);
      var e = c2e[c];
      if (len === 1 || typeof e !== "undefined") {
        array.push(c);
        break;
      }
    }
    i=i+Math.max(1,len);
  }
  return array;
}

MT.wordMt = function(w, s2t) {
  for (var i=0; i<MT.suffixList.length; i++) {
    var parts=MT.suffixList[i].split("=");
    var tail = parts[0], newTail=parts[1], pattern=parts[2];
    if (w.endsWith(tail)) {
      var w0 = w.substr(0, w.length-tail.length)+newTail;
      var wt = s2t[w0.toLowerCase()];
      if (typeof wt !== 'undefined') {
        if (typeof pattern !== 'undefined') {
          wt = pattern.replace('%c', wt);
        }
        return wt;
      }
    }
  }
//  return w;
}

MT.lex = function(text, c2e) {
  var words=[], m;
  while (m = MT.wordRegex.exec(text)) {
    var word = m[0];
    if (typeof m[4] !== 'undefined') {
      words.push(m[4]);
    } else if (typeof m[3] !== 'undefined') {
      words.push(m[3]);
    } else if (typeof m[2] !== 'undefined') {
      var cwords = MT.clex(m[2], c2e);
      cwords.forEach((c)=>words.push(c));
    } else {
      words.push(m[1]);
    }
  }
  return words;
}

MT.mt = function(s, s2t) {
  var t = [];
  for (i in s) {
    var sword = s[i];
    if (sword === '__br__') 
      tword = '<br/>';
    else {
      var sw = sword.toLowerCase();
      var tword = MT.wordMt(sw, s2t);
      if (typeof tword === 'undefined') {
        if (/^((\w+)|([\u4E00-\u9FFF]+]))$/i.test(sw) && 
          typeof e2c[sw] ==='undefined' && typeof c2e[sw] === 'undefined')
          tword = sw+'=?';
        else
          tword = sw;
      }
    }
    t.push(tword);
  }
  return t;
}


MT.mtHtml = function(html, s2t) {
  return html.replace(/((<\/?(\w+).*?>)([^<]*))/gi, function(flag, $1, $2, $3, $4, end) {
    if ($3.toLowerCase() === 'script' || $3.toLowerCase()==='style')
      return $1;
    else {
      var sWords = MT.lex($4, c2e);
//      console.log("$3=%s", $3);
//      console.log("sWords=", sWords);
      return $2+MT.mt(sWords, s2t).join(' ');
    }
  });
}
