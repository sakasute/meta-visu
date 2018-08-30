// HACK: manual polyfills
/* eslint-disable */
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function(callback, thisArg) {
    thisArg = thisArg || window;
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

if (window.NodeList && !NodeList.prototype.remove) {
  // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
  (function nodelistRemovePolyfill(arr) {
    arr.forEach(item => {
      if (item.hasOwnProperty('remove')) {
        return;
      }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          if (this.parentNode !== null) this.parentNode.removeChild(this);
        },
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
}
/* eslint-enable */
