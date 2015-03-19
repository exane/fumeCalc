var $ = require("jquery");

var Account = (function(){
  var Account = function(selector, name = "unnamed"){
    if(!(this instanceof Account)){
      return (new Account(selector, name));
    }
    /**
     * constructor here
     */
    this._name = name;
    this.$ref = selector;

  };
  var r = Account.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r._name = null;
  r._val = null;
  r.$ref = null;

  r.getVal = function() {
    return this._val;
  }

  r.changeVal = function(val) {
    this._val += val;
    this.render();
  }

  r.setVal = function(val) {
    this._val = Number(val);
    this.render();
  }

  r.render = function() {
    this.$ref.text(this.getVal() / 100);
  }


  return Account;
})();

module.exports = Account;