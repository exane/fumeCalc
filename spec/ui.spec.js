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