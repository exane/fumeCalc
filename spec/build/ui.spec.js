!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.test=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var UI = require("../web/js/UI.js");

describe("ui", function(){
    var ui;

    beforeEach(function(){
        ui = new UI();
    })

    describe("removePointAndComma", function(){
        var t;

        beforeEach(function(){
            t = ui.removePointAndComma;
        })

        it("100 => 10000", function(){
            expect(t("100")).toEqual("10000");
        })
        it("100,1 => 10010", function(){
            expect(t("100,1")).toEqual("10010");
        })
        it("100,101 => 10010", function(){
            expect(t("100,101")).toEqual("10010");
        })
        it("100, => 10000", function(){
            expect(t("100,")).toEqual("10000");
        })
        it("100. => 10000", function(){
            expect(t("100.")).toEqual("10000");
        })
        it("100.101 => 10010", function(){
            expect(t("100.101")).toEqual("10010");
        })
        it("10.2 => 1020", function(){
            expect(t("10.2")).toEqual("1020");
        })

    })

    describe("_trimDeci", function(){
        var t;
        beforeEach(function(){
            t = ui._trimDeci;
        })

        it("101 => 10", function(){
            expect(t("101")).toEqual("10");
        })
        it("1010 => 10", function(){
            expect(t("1010")).toEqual("10");
        })
        it("1 => 10", function(){
            expect(t("1")).toEqual("10");
        })
        it("01 => 01", function(){
            expect(t("01")).toEqual("01");
        })
    })

























})
},{"../web/js/UI.js":4}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
var fs = require("fs");

var DB = (function(){
    var DB = function(){
        //this._historyAsArray = [];
    }
    var r = DB.prototype;

    r._history = null;
    r._account = null;
    r._historyAsArray = null;

    r.load = function(dataDB, accountCB){
        var self = this;
        fs.readFile("data.json", {"encoding": "utf8"}, function(err, data){
            if(err) console.log(err);
            if(!data) {
                self._history = {};
                self._account = 0;
                self.createHistoryArray(self._history);
                dataDB.call(this, self._history);
                accountCB.call(this, self._account);

                return -1;
            }

            self._history = JSON.parse(data).history;
            self._account = JSON.parse(data).account;
            self.createHistoryArray(self._history);

            dataDB.call(this, self._history);
            accountCB.call(this, self._account);

        });
    }

    /**
     *
     * @param {UI.parseSaveObj} saveObj
     */
    r.save = function(saveObj, cb){

        var history = {};
        var n = this._historyAsArray.push(saveObj);
        var endfile = "";

        for(var i = 0; i < n; i++) {
            history[i] = this._historyAsArray[i];
        }

        this._account = saveObj.after;

        endfile = this.mergeToEndFile(this._account, history)

        fs.writeFile("data.json", endfile, function(err){
            if(err) console.log(err);
            else
                console.log("saved!");
            cb(err);
        });
    }

    r.mergeToEndFile = function(account, history){
        var obj = {};

        obj.account = account;
        obj.history = history;

        return JSON.stringify(obj);

    }

    r.createHistoryArray = function(json){
        var i = 0;
        this._historyAsArray = [];
        for(var obj in json) {
            this._historyAsArray[i++] = json[obj];
        }
    }

    return DB;
})();

module.exports = DB;
},{"fs":2}],4:[function(require,module,exports){
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
        this._cancelButton = $("#cancelButton");
        this._saveButton = $("#saveButton");
        this._field = $("#addField");
        this._dataTable = $("#dataEntries");
        this._amountField = $("#betrag");
        this._noteField = $("#bemerkung");
        this._dateEditField = $("#customDate");

        this._db = new DB();

        this._db.load(this.createTable, this.displayAccount);


        this._initEvents();
    }

    r._initEvents = function(){
        var self = this;
        this._addButton.click(function(e){
            self._onAddButtonClick.call(self, e);
        });
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

    }

    r._onAddButtonClick = function(e){
        this.toggleAddButton();
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

    r.parseSaveObj = function(){
        var tmp = this.removePointAndComma(this._amountField.val());
        var amount = tmp*1;
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
        val = tmp*1;

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


    return UI;
})();

module.exports = UI;
},{"./DB.js":3}]},{},[1])(1)
});