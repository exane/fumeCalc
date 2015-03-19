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
    this.add();
    this.$dataTable.html(this._table);
    return this;
  }


  return TablePreview;
})();

module.exports = TablePreview;