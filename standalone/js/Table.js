var $ = require("jquery");

var Table = (function(){
  var Table = function(obj = {}){
    if(!(this instanceof Table)){
      return (new Table(obj));
    }
    /**
     * constructor here
     */


    this._data = obj;
    //this._addNewEntry(obj);
  };
  var r = Table.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._data = null;
  r._table = null;
  r._doNotPrependFlag = null;

  r.$dataTable = $("#dataEntries");

  r._prepend = function(table) {
    this.$dataTable.prepend(table);
  }

  r.add = function(){
    var data = this._data;
    data.before = typeof data.before !== "undefined" ? data.before : data.account_before;

    var before = data.before >= 0 ? data.before / 100 + "&euro;" : "<span class='red'>" + data.before / 100 + "&euro;" + "</span>";
    var deduction = data.deduction >= 0 ? data.deduction / 100 + "&euro;" : "<span class='red'>" + data.deduction / 100 + "&euro;" + "</span>";
    var after = data.after >= 0 ? data.after / 100 + "&euro;" : "<span class='red'>" + data.after / 100 + "&euro;" + "</span>";

    var table = this._table = $("<tr>" +
    "<td>" + data.date + "</td>" +
    "<td>" + before + "</td>" +
    "<td>" + deduction + "</td>" +
    "<td>" + data.fees / 100 + "&euro;</td>" +
    "<td>" + after + "</td>" +
    "<td>" + data.note + "</td>" +
    "<td>" + data.client + "</td>" +
    "<td>" + data.signed + "</td>" +
    "</tr>");

    if(data.isPrivate || Number(data.private)){
      table.addClass("private-pay");
    }

    if(!this._doNotPrependFlag) {
      this._prepend(table);
    }

    return this;
  }

  r.removeAll = function() {
    this.$dataTable.empty();
    return this;
  }


  return Table;
})();

module.exports = Table;