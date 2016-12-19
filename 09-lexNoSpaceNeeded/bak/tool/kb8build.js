var fs = require("fs");
var KB = require("../lib/kb");

var kb = { w2t:{}, c2e:{}, e2c:{} };

var e2cText= fs.readFileSync('./e2c.dic', 'utf-8');
var e2c = KB.dic2map(e2cText);

var c2eText= fs.readFileSync('./c2e.dic', 'utf-8');
var c2e = KB.dic2map(c2eText);

var kbText= fs.readFileSync('./kb8.txt', 'utf-8');
KB.addOntology(kb, kbText);

KB.ecMerge(kb, e2c, 'e2c');
KB.ecMerge(kb, c2e, 'c2e');
// var kbJson = JSON.stringify(kb, null, ' ');
fs.writeFileSync("./kb8.json", JSON.stringify(kb, null, ' '), 'utf-8');

