var AccManager = require("./AccountManager");
var $ = require("jquery");
var moment = require("moment");
var accounting = require("accounting");

var Helper = (function(){
  var Helper = {};
  var r = Helper;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r.AccManager = AccManager();
  r.accounting = (function() {
    accounting.settings = {
      currency: {
        symbol : "€",   // default currency symbol is '$'
        format: "%v%s", // controls output: %s = symbol, %v = value/number (can be object: see below)
        decimal : ",",  // decimal point separator
        thousand: ".",  // thousands separator
        precision : 2   // decimal places
      },
      number: {
        precision : 2,  // default precision on numbers is 0
        thousand: ".",
        decimal : ","
      }
    }
    return accounting;
  })();

  r.parseSaveObj = function(isPrivate = false){
    var tmp = this.removePointAndComma($("#betrag").val());
    tmp = accounting.formatMoney(tmp);
    //var amount = tmp * 1;
    var amount = accounting.unformat(tmp);
    var note = $("#bemerkung").val();
    var signed = $("#username").val();

    var fees, sum, fee, before;

    var date = moment().format("DD.MM.YYYY, HH:mm");

    fees = this.calcFees(amount, $("#gebühren").val());
    sum = (this.AccManager.get("fume").getVal() + fees.sum);
    fee = fees.fee;

    before = this.AccManager.get(isPrivate?signed:"fume").getVal()

    if(isPrivate) {
      fee = 0;
      amount /= 2;
      amount = accounting.toFixed(amount, 0)*1;
      sum = before + amount;
    }


    if($("#customDate").val() !== ""){
      date = $("#customDate").val();
      date = moment(date, "DD.MM.YYYY").set({
        "hour": moment().get("hour"),
        "minute": moment().get("minute")
      }).format("DD.MM.YYYY, HH:mm");
    }


    var obj = {
      "date": date,
      "before": before,
      "deduction": amount,
      "fees": fee,
      "client": $("#kunde").val(),
      "signed": signed,
      "after": sum,
      "note": note,
      "isPrivate": this.isPrivate(),
      "accounts": this.AccManager.toFlatObj()
    }

    return obj;
  }

  r.isPrivate = function(){
    return $("#checkboxPrivate").prop("checked");
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
    res += this._trimDeci(a[1]);


    return res;
  }

  r._trimDeci = function(string){
    var res = "";
    res += (string[0] || "0") + (string[1] || "0");
    return res;
  }

  r.doItRedIfNecessary = function(input){
    return input * 1 >= 0 ? input + "€" : "<span class='red'>" + input + "€</span>";
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
      fee = fee < 0 ? fee * (-1) : fee;
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



  return Helper;
})();

module.exports = Helper;