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
  r._account = {};
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
    this._handleTableHeight();
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
    this._feesField = $("#gebühren");
    this._clientField = $("#kunde");
    this._usernameField = $("#username");
    this._privateCheckbox = $("#checkboxPrivate");
    this._dataWrapper = $(".data-wrapper");

    this._usernameField.val(this.username());

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
    this._privateCheckbox.click(this._onCheckBox.bind(this));

    this._amountField.keyup(function(e){
      self._renderEntryPreview();
    });
    this._noteField.keyup(function(e){
      self._renderEntryPreview();
    });
    this._dateEditField.keyup(function(e){
      self._renderEntryPreview();
    });
    this._clientField.keyup(this._renderEntryPreview.bind(this));
    this._feesField.keyup(this._renderEntryPreview.bind(this));
    this._usernameField.keyup(function(e){
      this._renderEntryPreview(e);
    }.bind(this));
    $(window).on("resize", this._handleTableHeight.bind(this))

  }

  r.username = function(name){
    if(!name) return localStorage["fumecalc_name"] || "";
    return localStorage["fumecalc_name"] = $.trim(name.toLowerCase());
  }

  r._onAddButtonClick = function(e){
    this.toggleAddButton();
  }

  r._onCheckBox = function(e) {
    this._renderEntryPreview();
  }

  r._onRefreshButtonClick = function(e){
    this.emptyTable();
    this.createTable();
  }

  r.emptyTable = function(){
    this._dataTable.empty();
    this._db.load(this.createTable, this.displayAccount);
  }

  r._onSaveButtonClick = function(e){
    this.username(this._usernameField.val());
    var data = this.parseSaveObj();
    var self = this;
    if(!self.validateFields()) {
      return;
    }
    this.handlePrivateKonto(data);
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

  r.validateFields = function() {
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
    var sign = $("#saveSuccessAlert");
    sign.show(400).delay(1000).hide(300);
  }

  r.displayWarningAlert = function(err){
    var sign = $("#saveWarningAlert");
    sign.text(err);
    sign.show(400).delay(8000).hide(300);
  }

  r.updateAccount = function(data){
    //var badge = $('[data-name="fume"]');
    for(var acc in this.getAccounts()) {
      var badge = $('[data-name="'+acc+'"]');
      badge.text(data.accounts[acc] / 100);
      this.getAccounts()[acc] = data.accounts[acc];
    }
  }

  r.displayAccount = function(account, only){
    var badge = $(".badge");
    only = only || false;
    root._account.fume = parseInt(account.fume);
    for(var acc in account) {
      root._account[acc] = parseInt(account[acc])
      badge.find('[data-name=' + acc + ']').text(root._account[acc] / 100);
    }
    if(only) return;
    root._renderEntryPreview()
  }

  r.getAccounts = function() {
    return this._account;
  }

  r.addNewEntry = function(data){

    var before = data.before >= 0 ? data.before / 100 + "&euro;" : "<span class='red'>" + data.before / 100 + "&euro;" + "</span>";
    var deduction = data.deduction >= 0 ? data.deduction / 100 + "&euro;" : "<span class='red'>" + data.deduction / 100 + "&euro;" + "</span>";
    var after = data.after >= 0 ? data.after / 100 + "&euro;" : "<span class='red'>" + data.after / 100 + "&euro;" + "</span>";

    var table = $("<tr>" +
    "<td>" + data.date + "</td>" +
    "<td>" + before + "</td>" +
    "<td>" + deduction + "</td>" +
    "<td>" + data.fees / 100 + "&euro;</td>" +
    "<td>" + after + "</td>" +
    "<td>" + data.note + "</td>" +
    "<td>" + data.client + "</td>" +
    "<td>" + data.signed + "</td>" +
    "</tr>");

    if(data.isPrivate){
      table.addClass("private-pay");
    }
    this._dataTable.prepend(table);
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

  r._drawTable = function(data){

    var before = data.account_before >= 0 ? data.account_before / 100 + "&euro;" : "<span class='red'>" + data.account_before / 100 + "&euro;" + "</span>";
    var deduction = data.deduction >= 0 ? data.deduction / 100 + "&euro;" : "<span class='red'>" + data.deduction / 100 + "&euro;" + "</span>";
    var after = data.after >= 0 ? data.after / 100 + "&euro;" : "<span class='red'>" + data.after / 100 + "&euro;" + "</span>";

    //after = data.private*1 ? "(Privat)" : after;
    var table = $("<tr>" +
    "<td>" + data.date + "</td>" +
    "<td>" + before + "</td>" +
    "<td>" + deduction + "</td>" +
    "<td>" + data.fees / 100 + "&euro;</td>" +
    "<td>" + after + "</td>" +
    "<td>" + data.note + "</td>" +
    "<td>" + data.client + "</td>" +
    "<td>" + data.signed + "</td>" +
    "</tr>");

    if(data.private*1){
      table.addClass("private-pay");
    }
    this._dataTable.prepend(table);

  }

  r.parseSaveObj = function(){
    var tmp = this.removePointAndComma(this._amountField.val());
    var amount = tmp * 1;
    var note = this._noteField.val();

    var date = new Date();
    var d, m, y;
    var fees, sum, fee;
    d = date.getDate();
    m = date.getMonth() + 1;
    y = date.getFullYear();

    date = d + "." + m + "." + y;

    fees = this.calcFees(amount, this._feesField.val());
    sum = (this.getAccounts().fume + fees.sum);
    fee = fees.fee;



    if(this._dateEditField.val() !== ""){
      date = this._dateEditField.val();
    }


    var obj = {
      "date": date,
      "before": this.getAccounts().fume,
      "deduction": amount,
      "fees": fee,
      "client": this._clientField.val(),
      "signed": this.username(),
      "after": sum,
      "note": note,
      "isPrivate": this.isPrivate()
    }

    return obj;
  }

  r.getUsername = function() {
    return $.trim(this._usernameField.val());
  }

  r.isPrivate = function() {
    return this._privateCheckbox.prop("checked");
  }

  r.handlePrivateKonto = function(obj) {
    var accs = this.getAccounts();
    obj.accounts = accs;
    if(!this.isPrivate()) {
      accs["fume"] = obj.after;
      return;
    }
    var user = obj.signed;
    var otheruser = user === "tim" ? "viktor" : "tim";

    accs[user] += (obj.after - obj.before)/2;
    accs[otheruser] -= (obj.after - obj.before)/2;

    accs["fume"] = obj.after;
    obj.isPrivate = user;

    obj.accounts = accs;

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
    var obj = this.parseSaveObj();
/*
    var before = obj.isPrivate ? this.getAccounts()[this.getUsername()]: obj.before;
    var after = obj.isPrivate ? this.getAccounts()[this.username()]+obj.deduction/2: obj.after;*/


    table.html(
    "<tr>" +
    "<td>" + obj.date + "</td>" +
    "<td>" + this.doItRedIfNecessary(obj.before / 100) + "</td>" +
    "<td>" + this.doItRedIfNecessary(obj.deduction / 100) + "</td>" +
    "<td>" + obj.fees / 100 + "€</td>" +
    "<td>" + this.doItRedIfNecessary(obj.after / 100) + "</td>" +
    "<td>" + obj.note + "</td>" +
    "<td>" + obj.client + "</td>" +
    "<td>" + this._usernameField.val() + "</td>" +
    "</tr>"
    );
  }

  r.calcFees = function(val, fees){
    var textVal = "" + fees;
    var regex = (/^([\d\.,]*)(.*)?/ig).exec(textVal);
    var fee = this.removePointAndComma(regex[1]);
    var type = $.trim(regex[2]) || "€";
    var sum = null;

    if(type === "%"){
      fee /= 100;
      fee = parseInt(val * fee / 100);
      //fee = parseInt(fee*100)/100;
      fee = fee<0? fee*(-1):fee;
      sum = val - fee;
    }
    if(type === "€"){
      sum = val - fee;
    }


    return {
      sum: sum,
      fee: fee
    };
  }

  r.doItRedIfNecessary = function(input){
    return input * 1 >= 0 ? input + "€" : "<span class='red'>" + input + "€</span>";
  }

  r._handleTableHeight = function(){
    var windowHeight = $(window).height();
    var delta = 100;
    if(!this._isFieldHidden()){
      delta += 336;
    }
    this._dataWrapper.height(windowHeight - delta);
  }


  return UI;
})();

module.exports = UI;