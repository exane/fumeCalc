var Account = require("./Account");
var $ = require("jquery");

var AccountManager = (function(){
  var AccountManager = function(){
    if(!(this instanceof AccountManager)){
      return (new AccountManager());
    }
    if(AccountManager._instance) {
      return AccountManager._instance;
    }
    AccountManager._instance = this;
    /**
     * constructor here
     */


  };
  var r = AccountManager.prototype;
  AccountManager._instance = null;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._accounts = {};

  r.add = function(name) {
    var selector = $("[data-name='"+name.toLowerCase()+"']");
    this._accounts[name.toLowerCase()] = (Account(selector, name));
  }

  r.get = function(name = null) {
    if(name) {
      return this._accounts[name.toLowerCase()];
    }
    return this._accounts;
  }

  r.updateAccounts = function(accounts) {
    for(var accName in accounts) {
      var acc = this.get(accName);
      acc.setVal(accounts[accName]);
    }
  }

  r.toFlatObj = function() {
    var res = {};
    for(var acc in this.get()) {
      res[acc] = this.get(acc).getVal();
    }
    return res;
  }

  r.renderAll = function() {
    this.each(function() {
      this.render();
    });
  }

  r.each = function(cb) {
    var accounts = this.get();
    for(var accName in accounts) {
      var acc = accounts[accName];
      cb.call(acc, acc)
    }
  }

  r.calculate = function(obj){
    var accs = this.get();
    if(!obj.isPrivate){
      accs["fume"].setVal(obj.after);
      return;
    }
    var user = obj.signed;

    //accs[user] += (obj.after - obj.before) / 2;
    //accs[user].changeVal((obj.after - obj.before) / 2);
    accs[user].changeVal(obj.deduction);
    //accs[otheruser] -= (obj.after - obj.before) / 2;
    //accs[otheruser].changeVal(-(obj.after - obj.before) / 2);

    //accs["fume"].setVal(obj.after);
    obj.isPrivate = user;
  }

  return AccountManager;
})();

module.exports = AccountManager;