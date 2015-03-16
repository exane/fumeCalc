var $ = require("jquery");

var DB = (function(){
  var DB = function(){
    if(!(this instanceof DB)){
      return (new DB());
    }
    /**
     * constructor here
     */


  };
  var r = DB.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._history = null;
  r._account = null;
  r._historyAsArray = null;

  r.load = function(dataDB, accountCB) {
    var self = this;
    $.ajax("php/ajaxController.php", {
      data: {
        loadDB: true
      }
    })
    .done(function(res){
      res = JSON.parse(res);
      console.log(res);
      self._history = res.history;
      self._account = res.account;
      dataDB.call(self, self._history);
      accountCB.call(self, self._account);
    });
  }

  r.save = function(saveObj, cb) {
    this._account = saveObj.after;
    $.ajax("php/ajaxController.php", {
      type: "POST",
      data: {
        saveDB: true,
        obj: saveObj
      }
    })
    .done(function(res){
      cb(res);
    });
  }


  return DB;
})();

module.exports = DB;