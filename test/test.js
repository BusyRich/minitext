var assert = require('assert'),
    minitext = require('../minitext');

describe('MiniText', function() {
  var txt = 'line one\nline two\n[face]:P[/face]\nline four',
      normal = {
        open: '[face]',
        close: '[/face]',
        render: function(content) {
          return 'Your face is: ' + content;
        }
      };

  it('should be able to add a wrapper-type processor', function() {
    minitext.add(normal);
    assert.equal(minitext(txt), 'line one\nline two\nYour face is: :P\nline four');
  });

  it('should allow omission of close.', function() {
    minitext.remove();
    minitext.add({
      open: normal.open,
      render: normal.render
    });

    assert.equal(minitext(txt), 'line one\nline two\nYour face is: :P[/face]\nline four');
  });

  it('should allow custom regular expressions', function() {
    minitext.remove();
    minitext.add({
      regex: /line ([a-z]+)/g,
      render: normal.render
    });

    assert.equal(minitext(txt), 'Your face is: one\nYour face is: two\n[face]:P[/face]\nYour face is: four');
  });

  it('should allow selecting full text', function() {
    minitext.remove();
    minitext.add({
      regex: /([\s\S]*)/g,
      render: normal.render
    });

    assert.equal(minitext(txt), 'Your face is: ' + txt);
  });

  it('should default to match each line', function() {
    minitext.remove();
    minitext.add({
      render: normal.render
    });

    assert.equal(
      minitext(txt),
      'Your face is: line one\nYour face is: line two\nYour face is: [face]:P[/face]\nYour face is: line four');
  });

  it('should load multiple processors in order', function() {
    minitext.remove();
    minitext.add(normal);
    minitext.add({
      regex: /(Your face is)/g,
      render: function(content) {
        return content + ' not';
      }
    });

    assert.equal(minitext(txt), 'line one\nline two\nYour face is not: :P\nline four');
  });
});
