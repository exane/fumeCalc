var AccManager = require("./AccountManager");
var $ = require("jquery");

var Helper = (function(){
  var Helper = {};
  var r = Helper;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r.AccManager = AccManager();

  r.parseSaveObj = function(){
    var tmp = this.removePointAndComma($("#betrag").val());
    var amount = tmp * 1;
    var note = $("#bemerkung").val();


    var date = new Date();
    var d, m, y;
    var fees, sum, fee;
    d = date.getDate();
    m = date.getMonth() + 1;
    y = date.getFullYear();

    date = d + "." + m + "." + y;

    fees = this.calcFees(amount, $("#gebühren").val());
    sum = (this.AccManager.get("fume").getVal() + fees.sum);
    fee = fees.fee;


    if($("#customDate").val() !== ""){
      date = $("#customDate").val();
    }


    var obj = {
      "date": date,
      "before": this.AccManager.get("fume").getVal(),
      "deduction": amount,
      "fees": fee,
      "client": $("#kunde").val(),
      "signed": $("#username").val(),
      "after": sum,
      "note": note,
      "isPrivate": this.isPrivate()
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