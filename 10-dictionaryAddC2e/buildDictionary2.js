var fs = require("fs");
var KB = {}

KB.set=function(map, key, value, replace=false) { // , replace=false
  if (!replace && typeof map[key] !== 'undefined' && value !== map[key]) {
    console.log("");
    console.log("// "+key+'='+map[key])
    console.log(key+'='+value);
    return true;
  }
  map[key] = value;
  return true;
}

var filterDic = [];
KB.dic2json = function(s2t, t2s, dic, replace=false) {
  var lines = dic.split("\n");
  for (var i=0, len=lines.length; i<len; i++) {
    var line = lines[i].replace(/[\r\t]/, '');
    if (line.trim() === "") continue;
    if (line.startsWith("// ")) continue;
    var m = line.match(/(^.*?)=(.*)$/);
    if (!m) continue;
    var key = m[1].trim(), value=m[2].trim();
    if (key.indexOf("'")<0) {
      if (KB.set(s2t, key, value, replace) && KB.set(t2s, value, key, replace))
        filterDic.push(line);
    }
  }
}

// e2c 有 s 的還沒去完
// var dicDup = fs.readFileSync('./e2c.dup', 'utf-8');
var dicE2c = fs.readFileSync('./e2c.dic', 'utf-8');
var dicC2e = fs.readFileSync('./c2e.dic', 'utf-8');
var e2c={}, c2e={};
KB.dic2json(e2c, c2e, dicE2c);
KB.dic2json(c2e, e2c, dicC2e);

fs.writeFileSync("e2c.json", JSON.stringify(e2c, null, ' '), 'utf-8');
fs.writeFileSync("c2e.json", JSON.stringify(c2e, null, ' '), 'utf-8');
fs.writeFileSync("e2c.js", 'var e2c='+JSON.stringify(e2c, null, ' '), 'utf-8');
fs.writeFileSync("c2e.js", 'var c2e='+JSON.stringify(c2e, null, ' '), 'utf-8');

