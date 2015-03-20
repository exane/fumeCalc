var Table = require("./Table");
var $ = require("jquery");
var Helper = require("./Helper");


var TablePreview = (function(){
  var TablePreview = function(obj = Helper.parseSaveObj()){
    if(!(this instanceof TablePreview)){
      return (new TablePreview(obj));
    }
    Table.call(this, obj);
    /**
     * constructor here
     */
    this.update();
  };
  TablePreview.prototype = Object.create(Table.prototype);
  var r = TablePreview.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r.$dataTable = $("#entryPreview");
  r._doNotPrependFlag = true;

  r.update = function() {
    this._checkPrivate();
    this.add();
    this.$dataTable.html(this._table);
    return this;
  }
  r._checkPrivate = function() {
    var data = this._data;
    if(!data.isPrivate) return;
    data.before = this.AccManager.get(data.signed).getVal();
    data.deduction /= 2;
    data.deduction = Helper.accounting.toFixed(data.deduction, 0)*1;
    data.after = data.before + data.deduction;
    data.fees = 0;
  }


  return TablePreview;
})();

module.exports = TablePreview;