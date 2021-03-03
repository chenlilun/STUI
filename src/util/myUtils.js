let checkIsSilkCar = function(code) {
  if (code && (code.length === 10 || code.length === 11)) {
    return true
  } else {
    return false
  }
}
let checkIsSilk = function(code) {
  if (code && code.length === 14) {
    return true
  } else {
    return false
  }
}

let checkMachine = function(code) {
  if (code && code.indexOf(',') != -1) {
    return true
  } else {
    return false
  }
}
let checkIsTemBox = function(code) {
  if (code && code.indexOf('/') != -1) {
    return true
  } else {
    return false
  }
}
let checkClick = function(a) {
  let flag = 0

  if (flag == 0) {
    flag = 1
    setTimeout(function() {
      flag = 0
    }, 500)
  } else {
    // showMsgDialog("请勿频繁点击！");
  }
  return flag
}

let checkCodeType = function(code) {
  // 丝车
  if (checkIsSilkCar(code)) return 'SILKCAR'
  // 丝锭
  if (checkIsSilk(code)) return 'SILK'
  // 机台
  if (checkMachine(code)) return 'MACHINE'
  // 暂存箱
  if (checkIsTemBox(code)) return 'TEMBOX'
}

export default {
  checkIsSilkCar,
  checkIsSilk,
  checkMachine,
  checkIsTemBox,
  checkClick,
  checkCodeType,
}
