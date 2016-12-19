var fs = require("fs");
// var path = require("path");

KB = {};

KB.readText=function(filePath) {
  return fs.readFileSync(filePath, 'utf-8').replace('\r','').replace('\t', ' ').split("\n");
}

KB.set=function(map, key, value) {
  if (typeof map[key] !== 'undefined')
    console.log("redefined :", key, " map[key]=", map[key], " value=", value);
  map[key] = value; 
}

KB.addOntology = function(kb, text) {
  var lines = text.split("\n");
  for (var i in lines) {
    var line = lines[i].replace(/[\r\t]/, '');
    var m = line.match(/(^.*?):(.*?),?(\/\/.*)?$/);
    if (!m) continue;
    var t = m[1], terms = m[2].split(",");
    for (var ti in terms) {
      var pairs = terms[ti].split("=");
      var c = pairs[0].trim();
      KB.set(kb.w2t, c, t);
      if (pairs.length == 2) {
        var e = pairs[1].trim();
        KB.set(kb.c2e, c.toLowerCase(), e);
        KB.set(kb.e2c, e.toLowerCase(), c);
      }
    }
  }
}

KB.dic2map = function(text) {
  var map = {};
  var lines = text.split("\n"); 
  for (var i=lines.length-1; i>=0; i--) {
    var line = lines[i].replace(/[\r\t]/, '');
    var m = line.match(/(^.*?)=(.*)$/);
    if (!m) continue;
    var key = m[1], value=m[2];
    map[key] = value;
  }
  return map;
}

KB.ecMerge=function(kb, s2t, type) {
  for (var s in s2t) {
    var t = s2t[s], c, e;
    if (type === 'c2e') {
      c=s; t=e;
    } else {
      c=t; e=s;
    }
    if (/^[A-Za-z]/.test(c)) continue;
    if (typeof kb.e2c[e] === 'undefined' && typeof kb.c2e[c] === 'undefined') {
      kb.e2c[e] = c; 
      kb.c2e[c] = e;
    }
  }
  return kb;
}

KB.merge=function(map1, map2) {
  for (var key in map2) {
    if (typeof map1[key] ==='undefined')
      map1[key] = map2[key];
  }
  return map1;
}

KB.rev = function(d) {
  var r={};
  for (var t in d) {
    var hits = (d[t] instanceof Array)?d[t]:[d[t]];
    for (var i in hits) {
      var w = hits[i];
      if (w.trim().length > 0)
        KB.set(r, w, t);
    }
  }
  return r;
}

// 詞類判斷
KB.isTag = function(w2tMap, w, tag) {
  var t = w;
  do {
    t = w2tMap[t];
    if (t === tag) return true;
  } while (typeof t !== 'undefined')
  return false;
}

function last(a) {
  if (a.length > 0)
    return a[a.length-1];
}

// 詞類取得
KB.getTags = function(w) {
  var t = w, tag, tag_, _tag;
  do {
    if (t[0]==='_') _tag = t;
    if (last[t]==='_') tag_ = t;
    var t1 = KB.w2tMap[t];
  } while (typeof t1 !== 'undefined');
  tag = t;
  return { tag:tag, _tag:_tag, tag_:tag_ };
}

module.exports = KB;