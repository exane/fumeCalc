var $ = require("jquery");
var DB = require("./DB.js");


var UI = (function(){
  var UI = function(){
    root = this;
  }
  var r = UI.prototype;
  var root = null;

  r._db = null;
  r._addButton = null;
  r._saveButton = null;
  r._cancelButton = null;
  r._field = null;
  r._dataTable = null;
  r._currentAccount = null;
  r._amountField = null;
  r._noteField = null;
  r._dateEditField = null;


  r.toggleAddButton = function(){
    if(this._isFieldHidden()){
      this._field.addClass("show");
      this._field.removeClass("hidden");
    }
    else {
      this._field.addClass("hidden");
      this._field.removeClass("show");
    }
  }

  r.init = function(){
    this._addButton = $("#addButton");
    this._refreshBtn = $("#refreshButton");
    this._cancelButton = $("#cancelButton");
    this._saveButton = $("#saveButton");
    this._field = $("#addField");
    this._dataTable = $("#dataEntries");
    this._amountField = $("#betrag");
    this._noteField = $("#bemerkung");
    this._dateEditField = $("#customDate");
    this._dataWrapper = $(".data-wrapper");

    this._db = new DB();

    this._handleTableHeight();

    this._db.load(this.createTable, this.displayAccount);


    this._initEvents();
  }

  r._initEvents = function(){
    var self = this;
    this._addButton.click(function(e){
      self._onAddButtonClick.call(self, e);
    });
    this._refreshBtn.click(this._onRefreshButtonClick.bind(this));
    this._cancelButton.click(function(e){
      self._onAddButtonClick.call(self, e);
    });
    this._saveButton.click(function(e){
      self._onSaveButtonClick.call(self, e);
    });

    this._amountField.keyup(function(e){
      self._renderEntryPreview();
    });
    this._noteField.keyup(function(e){
      self._renderEntryPreview();
    });
    this._dateEditField.keyup(function(e){
      self._renderEntryPreview();
    });
    $(window).on("resize", this._handleTableHeight.bind(this))

  }

  r._onAddButtonClick = function(e){
    this.toggleAddButton();
  }

  r._onRefreshButtonClick = function(e) {
    this.emptyTable();
    this.createTable();
  }

  r.emptyTable = function() {
    this._dataTable.empty();
    this._db.load(this.createTable, this.displayAccount);
  }

  r._onSaveButtonClick = function(e){
    var data = this.parseSaveObj();
    var self = this;
    this._db.save(data, function(err){
      if(err){
        self.displayWarningAlert(err);
        return -1;
      }
      self.addNewEntry.call(self, data);
      self.updateAccount.call(self, data);
      self.displaySuccessAlert.call(self);
      self.toggleAddButton();
      self.clearInputFields();
      self._renderEntryPreview();
    });
  }

  r.clearInputFields = function(){
    this._amountField.val("");
    this._noteField.val("");
    this._dateEditField.val("");
  }

  r.displaySuccessAlert = function(){
    var sign = $("#saveSuccessAlert");
    sign.show(400).delay(1000).hide(300);
  }

  r.displayWarningAlert = function(err){
    var sign = $("#saveWarningAlert");
    sign.text(err);
    sign.show(400);
  }

  r.updateAccount = function(data){
    var badge = $(".badge .value");
    badge.text(data.after / 100);
    this._currentAccount = data.after;
  }

  r.addNewEntry = function(data){

    var before = data.before >= 0 ? data.before / 100 + "&euro;" : "<span class='red'>" + data.before / 100 + "&euro;" + "</span>";
    var deduction = data.deduction >= 0 ? data.deduction / 100 + "&euro;" : "<span class='red'>" + data.deduction / 100 + "&euro;" + "</span>";
    var after = data.after >= 0 ? data.after / 100 + "&euro;" : "<span class='red'>" + data.after / 100 + "&euro;" + "</span>";

    this._dataTable.prepend(
    "<tr>" +
    "<td>" + data.date + "</td>" +
    "<td>" + before + "</td>" +
    "<td>" + deduction + "</td>" +
    "<td>" + after + "</td>" +
    "<td>" + data.note + "</td>" +
    "</tr>"
    );
  }

  r._isFieldHidden = function(){
    return this._field.hasClass("hidden");
  }

  /**
   *
   * @param {DB} data
   */
  r.createTable = function(data){
    var self = root;

    for(var obj in data) {
      //console.log(obj);
      self._drawTable(data[obj]);
    }
  }

  r.displayAccount = function(account){
    var badge = $(".badge .value");
    root._currentAccount = parseInt(account);
    badge.text(root._currentAccount / 100);
    root._renderEntryPreview()
  }

  r._drawTable = function(data){

    var before = data.account_before >= 0 ? data.account_before / 100 + "&euro;" : "<span class='red'>" + data.account_before / 100 + "&euro;" + "</span>";
    var deduction = data.deduction >= 0 ? data.deduction / 100 + "&euro;" : "<span class='red'>" + data.deduction / 100 + "&euro;" + "</span>";
    var after = data.after >= 0 ? data.after / 100 + "&euro;" : "<span class='red'>" + data.after / 100 + "&euro;" + "</span>";


    this._dataTable.prepend(
    "<tr>" +
    "<td>" + data.date + "</td>" +
    "<td>" + before + "</td>" +
    "<td>" + deduction + "</td>" +
    "<td>" + after + "</td>" +
    "<td>" + data.note + "</td>" +
    "</tr>"
    );

  }

  r.parseSaveObj = function(){
    var tmp = this.removePointAndComma(this._amountField.val());
    var amount = tmp * 1;
    var note = this._noteField.val();

    var date = new Date();
    var d, m, y;
    d = date.getDate();
    m = date.getMonth() + 1;
    y = date.getFullYear();

    date = d + "." + m + "." + y;


    if(this._dateEditField.val() !== ""){
      date = this._dateEditField.val();
    }

    var obj = {
      "date": date,
      "before": this._currentAccount,
      "deduction": amount,
      "after": (this._currentAccount + amount),
      "note": note
    }

    return obj;
  }

  /**
   * removePointAndComma
   * @param {string} input
   * @returns {*|void}
   */
  r.removePointAndComma = function(input){
    var n, a = [], res;

    if(input.indexOf(",") > 0){
      a = input.split(",");
    }
    else if(input.indexOf(".") > 0){
      a = input.split(".");
    }

    else
      return input + "00";

    res = a[0];
    res += root._trimDeci(a[1]);


    return res;
  }

  r._trimDeci = function(string){
    var res = "";
    res += (string[0] || "0") + (string[1] || "0");
    return res;
  }

  r._renderEntryPreview = function(){
    var table = $("#entryPreview");
    var tmp = this.removePointAndComma(this._amountField.val());


    var date = new Date();
    var d, m, y;
    var sum, val;
    d = date.getDate();
    m = date.getMonth() + 1;
    y = date.getFullYear();

    //val = this._amountField.val() * 100 | 0;
    val = tmp * 1;

    date = d + "." + m + "." + y;
    if(this._dateEditField.val() !== ""){
      date = this._dateEditField.val();
    }

    sum = (this._currentAccount + val);

    table.html(
    "<tr>" +
    "<td>" + date + "</td>" +
    "<td>" + this.doItRedIfNecessary(this._currentAccount / 100) + "</td>" +
    "<td>" + this.doItRedIfNecessary(val / 100) + "</td>" +
    "<td>" + this.doItRedIfNecessary(sum / 100) + "</td>" +
    "<td>" + this._noteField.val() + "</td>" +
    "</tr>"
    );
  }

  r.doItRedIfNecessary = function(input){
    return input * 1 >= 0 ? input + "€" : "<span class='red'>" + input + "€</span>";
  }

  r._handleTableHeight = function() {
    var windowHeight = $(window).height();
    this._dataWrapper.height(windowHeight - 100);
  }


  return UI;
})();

module.exports = UI;