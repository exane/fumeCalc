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