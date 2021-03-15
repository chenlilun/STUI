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

let dealSilkIngotList = function(data) {
  let { row, col, layer, silkCarRowColList = [] } = data
  !row && (row = 3)
  !col && (col = 5)
  !layer && (layer = 1)
  if (!(row && col && layer)) return []
  let list = []

  let sides = ['A', 'B']
  for (let m = 0; m < sides.length; m++) {
    for (let i = 1; i <= row; i++) {
      for (let k = 1; k <= layer; k++) {
        for (let j = 1; j <= col; j++) {
          let temp = []
          if (layer === 1) {
            temp.push(sides[m], i, j)
          } else {
            temp.push(sides[m], i, j, k)
          }
          list.push({
            position: `${sides[m]}${i}${j}`,
            showPosition: temp,
            sideType: sides[m],
            row: i,
            col: j,
            layer: k,
          })
        }
      }
    }
  }

  silkCarRowColList.forEach((v) => {
    let { sideType, row, col, layer } = v
    list.forEach((item) => {
      if (
        sideType === item.sideType &&
        row === item.row &&
        // layer === item.layer &&
        col === item.col
      ) {
        item = Object.assign(item, v)
      }
    })
  })
  return { list, col, row, layer }
}

export default {
  checkIsSilkCar,
  checkIsSilk,
  checkMachine,
  checkIsTemBox,
  checkClick,
  checkCodeType,
  dealSilkIngotList,
}
