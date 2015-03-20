window.$ = window.jQuery = require("jquery");
var DB = require("./DB.js");
var Table = require("./Table");
var AccManager = require("./AccountManager");
var Preview = require("./TablePreview");
var Helper = require("./Helper");
require("./jquery.tablesorter");
require("./jquery.tablesorter.widgets");

var UI = (function(){
  var UI = function(){
    root = this;

    r._saved = $.Deferred();
    this.AccManager = AccManager();
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
  r._account = {};
  r._amountField = null;
  r._noteField = null;
  r._dateEditField = null;
  r._payOutButton = null;
  r._payOutField = null;

  r._saved = null;
  r._suppressAlert = false;

  r.AccManager = null;
  r.tablesort = null;

  r._onAddButtonClick = function(e){
    this.toggleAddButton();
  }

  r._onCheckBox = function(e){
    //this._renderEntryPreview();

    this._feesField.removeAttr("disabled");
    if(Helper.isPrivate()){
      this._feesField.attr("disabled", "");
    }
    Preview();
  }

  r._onRefreshButtonClick = function(e){
    this.emptyTable();
    this.createTable();
    this.AccManager.renderAll();
  }

  r._onSaveButtonClick = function(e){
    this.username(this._usernameField.val());
    //var self = this;
    if(!this.validateFields()){
      return;
    }
    var data = Helper.parseSaveObj(Helper.isPrivate());
    //this.handlePrivateKonto(data);
    this.AccManager.calculate(data);
    this._save(data);
  }

  r._save = function(data){
    this._saved = $.Deferred();
    this._db.save(data, function(err){
      if(err){
        self.displayWarningAlert(err);
        return -1;
      }
      Table(data).add();
      this.displaySuccessAlert();
      this.toggleAddButton();
      this.clearInputFields();
      Preview(data);
      this._saved.resolve("saved");
    }.bind(this));
    return this._saved;
  }

  r._updateTableSort = function() {
    $(document).on("tablesort/update", function() {
      this.tablesort.trigger("updateAll", [true]);
    }.bind(this));
  }

  r._onPayOutButton = function(){
    var amount = parseInt(this._payOutField.val()) * 100 || this.AccManager.get("fume").getVal();
    var tim, vik, obj, self = this;

    if(amount > this.AccManager.get("fume").getVal()){
      this.displayWarningAlert("Input Error: number to large");
      return;
    }

    var res = {
      tim: amount / 2,
      vik: amount / 2
    };

    tim = this.AccManager.get("tim").getVal();
    vik = this.AccManager.get("viktor").getVal();

    res.tim += (tim - vik);
    res.vik += (vik - tim);

   /* self._preparePayOutFor("tim", res.tim);
    self._saveButton.click();

    this._suppressAlert = true;
    $.when(self._saved)
    .then(function(){
      self._preparePayOutFor("viktor", res.vik)
      self._saveButton.click();
    })
    .then(self._saved)
    .then(function(){
      self._preparePayOutFor("tim", res.tim, true)
      self._saveButton.click();
    })
    .then(self._saved)
    .then(function(){
      self._preparePayOutFor("viktor", res.vik, true)
      self._saveButton.click();
      self._suppressAlert = false;
    })
    .then(self._saved)
    .then(function() {
      self._suppressAlert = false;
    })*/
    var result = {};
    this._preparePayOutFor("tim", res.tim);
    result.tim_out = Helper.parseSaveObj();
    this.AccManager.calculate(result.tim_out);

    this._preparePayOutFor("viktor", res.vik);
    result.viktor_out = Helper.parseSaveObj();
    this.AccManager.calculate(result.viktor_out);


    this._preparePayOutFor("tim", res.tim, true);
    result.tim_private = Helper.parseSaveObj(true);
    this.AccManager.calculate(result.tim_private);

    this._preparePayOutFor("viktor", res.vik, true);
    result.viktor_private = Helper.parseSaveObj(true);
    this.AccManager.calculate(result.viktor_private);

    this._db.payOut(result, function(res) {
      for(var table in result) {
        Table(result[table]).add();
      }
    });

  }

  r._preparePayOutFor = function(name, amount, isPrivate = false){
    if(isPrivate) {
      this._amountField.val(-this.AccManager.get(name).getVal()*2 / 100);
      this._noteField.val("Gegenbuchung für die Auszahlung an " + name);
      this._privateCheckbox.prop("checked", true)
    }
    else {
      this._amountField.val(-amount / 100);
      this._noteField.val("Auszahlung an " + name);
      this._privateCheckbox.prop("checked", false)
    }
    this._clientField.val("devcode");
    this._usernameField.val(name);
    Preview();
  }

  r._handleTableHeight = function(){
    var windowHeight = $(window).height();
    var delta = 100;
    if(!this._isFieldHidden()){
      delta += 336;
    }
    this._dataWrapper.height(windowHeight - delta);
  }

  r._isFieldHidden = function(){
    return this._field.hasClass("hidden");
  }
  r._openPayOut = function() {

    this._payOutField.val(this.AccManager.get("fume").getVal()/100);
    $("#pay-out").toggleClass("hidden");

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
    this._privateCheckbox.click(this._onCheckBox.bind(this));


    this._payOutButton.click(this._onPayOutButton.bind(this));
    this._openPayOutButton.click(this._openPayOut.bind(this));

    this._updateTableSort();

    this._amountField.keyup(function(e){
      //self._renderEntryPreview();
      Preview();
    });
    this._noteField.keyup(function(e){
      //self._renderEntryPreview();
      Preview();
    });
    this._dateEditField.keyup(function(e){
      //self._renderEntryPreview();
      Preview();
    });
    this._clientField.keyup(function(){
      Preview();
    });
    this._feesField.keyup(function(){
      Preview();
    });
    this._usernameField.keyup(function(){
      Preview();
    });
    $(window).on("resize", this._handleTableHeight.bind(this))

  }

  r.toggleAddButton = function(){
    if(this._isFieldHidden()){
      this._field.addClass("show");
      this._field.removeClass("hidden");
    }
    else {
      this._field.addClass("hidden");
      this._field.removeClass("show");
    }
    this._handleTableHeight();
    Preview();
  }

  r.init = function(){
    this._addButton = $("#addButton");
    this._refreshBtn = $("#refreshButton");
    this._cancelButton = $("#cancelButton");
    this._saveButton = $("#saveButton");
    this._field = $("#addField");
    /*
        this._dataTable = $("#dataEntries");*/
    this._amountField = $("#betrag");
    this._noteField = $("#bemerkung");
    this._dateEditField = $("#customDate");
    this._feesField = $("#gebühren");
    this._clientField = $("#kunde");
    this._usernameField = $("#username");
    this._privateCheckbox = $("#checkboxPrivate");
    this._dataWrapper = $(".data-wrapper");

    this.tablesort = $("#dataEntries").parent().tablesorter({
      theme : 'metro-dark',
      ignoreCase: true,
      headerTemplate : '{content}{icon}',
      headers: {
        0: {sorter: "text"}
      },
      sortList: [[0, 1]]
    });

    this._payOutButton = $("#btn-pay-out");
    this._openPayOutButton = $("#payoutButton");
    this._payOutField = $("#pay-out-input");

    this._usernameField.val(this.username());

    this._db = new DB();

    this._handleTableHeight();

    this.AccManager.add("Fume");
    this.AccManager.add("Tim");
    this.AccManager.add("Viktor");


    this._db.load(this.createTable, this.AccManager);
    Preview();


    this._initEvents();
  }

  r.username = function(name){
    if(!name) return localStorage["fumecalc_name"] || "";
    return localStorage["fumecalc_name"] = $.trim(name.toLowerCase());
  }

  r.getUsername = function(){
    return $.trim(this._usernameField.val());
  }

  r.emptyTable = function(){
    Table().removeAll();
    this._db.load(this.createTable, this.AccManager);
  }

  r.createTable = function(data){
    var self = root;

    for(var obj in data) {
      Table(data[obj]).add();
    }

  }

  r.validateFields = function(){
    if(this.username() == "" || (this.username() != "tim" && this.username() != "viktor")){ //yo hardcoded
      console.error("Incorrect name. Are you not tim or viktor?");
      this.displayWarningAlert("Incorrect name. Are you not tim or viktor?");
      return false;
    }
    return true;
  }

  r.clearInputFields = function(){
    this._amountField.val("");
    this._feesField.val("");
    this._noteField.val("");
    this._dateEditField.val("");
    this._clientField.val("");
  }

  r.displaySuccessAlert = function(){
    if(this._suppressAlert) return;
    var sign = $("#saveSuccessAlert");
    sign.show(400).delay(1000).hide(300);
  }

  r.displayWarningAlert = function(err){
    if(this._suppressAlert) return;
    var sign = $("#saveWarningAlert");
    sign.text(err);
    sign.show(400).delay(8000).hide(300);
  }


  return UI;
})();

module.exports = UI;