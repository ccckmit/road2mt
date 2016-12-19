var L = {};

var wordRegex = /([\w']+)|([\u4E00-\u9FFF]+)|([\S\n\r]+)/gi;

L.lex = function(kb, text) {
  var words=[], m;
  while (m = wordRegex.exec(text)) {
    var word = m[0];
    if (typeof m[2] !== 'undefined') {
      var cwords = L.clex(kb, m[2]);
      cwords.forEach((c)=>words.push(c));
    }
    else
      words.push(m[0]);
  }
  return words;
}

L.clex = function(kb, text) {
  var array = [];
  for (var i=0; i<text.length; ) {
    for (var len=4; len>=1; len--) {
      var c = text.substr(i, len);
      var e = kb.c2e[c];
      if (len === 1 || typeof e !== "undefined") {
        array.push(c);
        break;
      }
    }
    i=i+Math.max(1,len);
  }
  return array;
}

// L.lex("The North Wind，and the Sun 約翰北風與太陽");

module.exports = L;

