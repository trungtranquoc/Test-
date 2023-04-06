
var triple = () => {
    console.log(x)
    var x = 5
}

var Obj = {
    x: 10,
    printX: function () {
        console.log(this.x)
    }
}

var Obj2 = {
    x: 15,
    printX: Obj.printX.bind(Obj)
}

Obj2.printX()
