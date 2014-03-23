;(function() {
  // extensions
  var exts = [],
      escapeRegex = /[-[\]{}()*+?.,\\^$|#\s]/g;

  var minitext = function(content) {
    if(typeof content !== 'string') {
      return content;
    }

    var match = null, previousLastIndex;
    for(var e = 0, ext; (ext = exts[e]); e++) {
      // resets the match index on the regular expression
      ext.regex.lastIndex = 0;
      previousLastIndex = -1;

      // extension uses a regular expression for replacements
      while((match = ext.regex.exec(content))) {
        if(match.length > 1) {
          content = content.replace(match[0], ext.render(match[1]));

          // prevents infinite loops for "match all" type expressions
          if(match[0] === match.input) {
            break;
          }
        }
      }
    }

    return content;
  };

  minitext.add = function(extension) {
    // copy the extension to prevent modifying the object passed in
    var ext = {};
    for(var p in extension) {
      ext[p] = extension[p];
    }

    // escape regex special characters in the opening and closing patterns
    if(typeof ext.open === 'string') {
      ext.open = ext.open.replace(escapeRegex, "\\$&");
    }

    if(typeof ext.close === 'string') {
      ext.close = ext.close.replace(escapeRegex, "\\$&");
    }

    // create a regular expression if one was not provided
    if(!ext.hasOwnProperty('regex')) {
      ext.regex = new RegExp((ext.open || '^') +
        '([\\s\\S]*?)' + // match any character, including newlines
        (ext.close || '$'), 'gm');
    }

    exts.push(ext);
  };

  minitext.remove = function(filter) {
    if(typeof filter === 'undefined') {
      exts = [];
    }
  };

  if(typeof exports === 'object') {
    module.exports = minitext;
  }
  else if(typeof window !== 'undefined') {
    window.minitext = minitext;
  }
})();
