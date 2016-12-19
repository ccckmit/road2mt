var MT = { };

var suffixList = [
  "=", "d==%cd", "s==%cs", "es==%ces", "ed==%ced", "ly==%cly", "al==%cal", 
  "er=e=%cer", "er==%cer", "'s==%c's", "ies=y=%cies", 
  "ion==%cion", "ion=e=%cion",
  "ing==%cing", "ing=e=%ceing", "est=e=%cest", "able==%cable" ];

// 加入 stemming, 然後在翻譯後復原

MT.translate=function(kb, w, s, t) {
  var s2t = kb[s+"2"+t];
  for (var i=0; i<suffixList.length; i++) {
    var parts=suffixList[i].split("=");
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
  return w;
}

MT.mt=function(kb, words, s, t) {
  var toWords = [];
  for (var i=0; i<words.length; i++) {
    toWords.push(MT.translate(kb, words[i], s, t));
  }
  return toWords;
}

module.exports = MT;

/*
// 單詞翻譯 : wordTranslate
MT.translate=function(w, s, t) {
  var s2t = kb8[s+"2"+t];
  c.log("w=", w, "s=", s, "t=", t);
  for (var i=0; i<suffixList.length; i++) {
    var parts=suffixList[i].split("=");
    var tail = parts[0], newTail=parts[1], pattern=parts[2];
//    c.log("parts=", parts);
    if (w.endsWith(tail)) {
//      c.log("w=", w);
      var w0 = w.substr(0, w.length-tail.length)+newTail;
//      c.log("w0=", w0);
      var wt = s2t[w0.toLowerCase()];
      if (typeof wt !== 'undefined') {
        if (typeof pattern !== 'undefined') {
          wt = pattern.replace('%c', wt);
        }
        return wt;
      }
    }
  }
  return w;
}
*/

/*
// 單詞翻譯 : wordTranslate
MT.translate=function(w, s, t) {
  var s2t = kb8[s+"2"+t];
  var wt = s2t[w.toLowerCase()];
  if (typeof wt === 'undefined')
    return w;
  else
    return wt;
}
*/
// c.log(MT.translate("stronger", "e", "c"));
// process.exit(1);

