var fs = require("fs");
var KB = {}

KB.set=function(map, key, value, replace=false) {
  if (typeof map[key] !== 'undefined' && value !== map[key]) {
    console.log("redefined :", key, " map[key]=", map[key], " value=", value);
    if (replace === false) return;
  }
  map[key] = value;
}

KB.dic2json = function(dic) {
  var s2t = {}, t2s = {};
  var lines = dic.split("\n");
  for (var i=lines.length-1; i>=0; i--) {
    var line = lines[i].replace(/[\r\t]/, '');
    var m = line.match(/(^.*?)=(.*)$/);
    if (!m) continue;
    var key = m[1], value=m[2];
    KB.set(s2t, key, value);
    KB.set(t2s, value, key);
  }
  return {s2t:s2t, t2s:t2s};
}

// e2c 有 s 的還沒去完
var e2c = fs.readFileSync('./e2c.dic', 'utf-8');
var ec  = KB.dic2json(e2c);

fs.writeFileSync("e2c.json", JSON.stringify(ec.s2t, null, ' '), 'utf-8');
fs.writeFileSync("c2e.json", JSON.stringify(ec.t2s, null, ' '), 'utf-8');

