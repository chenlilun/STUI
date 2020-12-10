let checkIsSilkCar = function checkIsSilk(code) {
    if (code && (code.length === 10 || code.length === 11)) {
        return true
    } else {
        return false
    }
}
let checkIsSilk = function checkIsSilk(code) {
    if (code && (code.length === 14)) {
        return true
    } else {
        return false
    }
}

let checkMachine = function checkIsSilk(code) {
    if (code && code.indexOf(',')!= -1) {
        return true
    } else {
        return false
    }
}
let checkIsTemBox = function checkIsSilk(code) {
    if (code && code.indexOf('/')!=-1) {
        return true
    } else {
        return false
    }
}
let checkClick = function(a) {
    let flag = 0;

        if (flag == 0) {
            flag = 1;
            setTimeout(function() {
                flag = 0;
            }, 500);
        } else {
            // showMsgDialog("请勿频繁点击！");
        }
        return flag
};


export default {
    checkIsSilkCar ,checkIsSilk ,checkMachine,checkIsTemBox,checkClick
}
