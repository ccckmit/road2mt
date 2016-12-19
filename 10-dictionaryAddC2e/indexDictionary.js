var fs = require("fs");

var e2c = JSON.parse(fs.readFileSync('./e2c.json', 'utf-8'));
var c2e = JSON.parse(fs.readFileSync('./c2e.json', 'utf-8'));

function add(idx, i, c, e) {
  var hit = idx[c[i]];
  if (typeof hit === 'undefined') {
    idx[c[i]] = hit = {}
  }
  hit[c] = e;
}

function indexJson(c2e) {
  var idx={};
  for (var c in c2e) {
    var e = c2e[c];
    for (var i = 0; i < c.length; i++) {
      add(idx, i, c, e);
    }
  }
  return idx;
}

function headMatchIdx(idx, head) {
  var hit = idx[head[0]];
  var result={}
  for (var h in hit) {
    var v = hit[h];
    if (h.startsWith(head))
      result[h] = v;
  }
  return result;
}

var idx = indexJson(c2e);
console.log("idx[是]=", idx["是"]);
console.log("idx[成]=", idx["成"]);
console.log('headMatchIdx(idx, "成")=', headMatchIdx(idx, "成"));
console.log('headMatchIdx(idx, "小")=', headMatchIdx(idx, "小"));
console.log('headMatchIdx(idx, "小說")=', headMatchIdx(idx, "小說"));

