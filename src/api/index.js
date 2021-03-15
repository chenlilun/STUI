// @ts-nocheck
import axios from 'axios'
import vue from '../main.js'
// @ts-ignore
import global from '../api/window_global.js'

axios.defaults.headers.common['Authorization'] = window.sessionStorage.token
  ? window.sessionStorage.token
  : 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoZW5neWkiLCIxIjoicGFzc3dvcmQiLCJpYXQiOjE1OTY0NTU4MzV9.OTsoZbKY49koIkthToN2tsYoiNdsCgQxqrg_USWKksY'

const baseUrl = global.ipPort
// 响应拦截器
axios.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    switch (error.response.status) {
      case 400:
        // vue.$notify.error({
        //   title: error.response.data.errorCode,
        //   message: error.response.data.errorMessage
        // })
        return Promise.reject(error)
      // break
      case 401:
        vue.$notify.error({
          title: '错误',
          message: '登录信息未认证',
        })
        break
      case 403:
        vue.$notify.error({
          title: '错误',
          message: '您没有权限进行此操作',
        })
        break
      case 404:
        vue.$notify.error({
          title: '错误',
          message: '未找到接口数据',
        })
        // store.state.pageLoading = false;
        break
      case 302:
        // window.location = '/'
        break
      case 500:
        // vue.$notify.error({
        //   title: '错误',
        //   message: '服务器错误'
        // })
        // localStorage.removeItem('token')
        // window.location = '/'
        break
      default:
        vue.$notify.error({
          title: '错误',
          message: `未知错误 ${error.response.status}`,
        })
        return Promise.reject(error)
    }
  }
)

export default {
  axios,
  /*getToken (params) {
      return axios.post(`${autoTokenUrl}`, params)
    },
    // =========================================== 自动化 ===========================================
    getAuth (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      return axios.get(`${baseAutoUrl}/auth`)
    }*/
  //查询车间
  selectWorkshops() {
    return axios.get(`${baseUrl}/api/workshop/selectWorkshops`)
  },
  //新增车间
  addWorkshop(parms) {
    return axios.post(`${baseUrl}/api/workshop/addWorkshop`, parms)
  },
  //查询产线
  selectLines(parms) {
    return axios.get(`${baseUrl}/api/line/selectLines/${parms}`)
  },
  //名称模糊查询产线
  selectLinesByName(parms) {
    return axios.get(`${baseUrl}/api/line/selectLinesByName/${parms}`)
  },
  //新增产线
  addLine(parms) {
    return axios.post(`${baseUrl}/api/line/addLine`, parms)
  },
  //删除产线
  deleteLine(parms) {
    return axios.delete(`${baseUrl}/api/line/deleteLine/${parms}`)
  },
  //查询机台
  selectMachines(parms) {
    return axios.get(`${baseUrl}/api/machine/selectMachines/${parms}`)
  },
  //查询机台
  addMachines(parms) {
    return axios.post(`${baseUrl}/api/machine/addMachine`, parms)
  },
  //修改机台
  updateMachines(parms) {
    return axios.post(`${baseUrl}/api/machine/updateMachine`, parms)
  },
  //删除机台
  deleteMachine(parms) {
    return axios.delete(`${baseUrl}/api/machine/deleteMachine/${parms}`)
  },
  //新增菜单
  addMenu(parms) {
    return axios.post(`${baseUrl}/api/menu/addMenu`, parms)
  },
  //查询菜单
  getAllMenu() {
    return axios.get(`${baseUrl}/api/menu/getAllMenu`)
  },
  //删除菜单
  deleteMenu(parms) {
    return axios.post(`${baseUrl}/api/menu/deleteMenu`, parms)
  },
  //新增角色
  addRole(parms) {
    return axios.post(`${baseUrl}/api/role/addRole`, parms)
  },
  //查询角色
  getAllRole() {
    return axios.post(`${baseUrl}/api/role/getAllRole`)
  },
  //获取角色id的菜单
  getMenuByRole(parms) {
    return axios.post(`${baseUrl}/api/role//getMenuByRole/${parms}`)
  },
  //修改权限
  updateRole(parms) {
    return axios.post(`${baseUrl}/api/role/updateRole`, parms)
  },
  //获取班次
  getAllClasses() {
    return axios.get(`${baseUrl}/api/classes/getAllClasses`)
  },
  //新建用户
  addUser(parms) {
    return axios.post(`${baseUrl}/api/user/addUser`, parms)
  },
  //查询用户
  getAllUser(parms) {
    return axios.post(`${baseUrl}/api/user/getAllUser`, parms)
  },
  //修改用户
  updateUser(parms) {
    return axios.post(`${baseUrl}/api/user/updateUser`, parms)
  },
  //删除用户
  deleteUser(parms) {
    return axios.post(`${baseUrl}/api/user/deleteUser/${parms}`, parms)
  },
  //重置密码
  resetPassword(parms) {
    return axios.post(`${baseUrl}/api/user/resetPassword/${parms}`)
  },
  //登录接口
  userLogin(parms) {
    return axios.post(`${baseUrl}/login/userLogin`, parms)
  },

  // 产品管理--添加
  addProduct(data) {
    return axios.post(`${baseUrl}/api/product/add`, data)
  },
  // 产品管理--获取数据
  getProduct() {
    return axios.get(`${baseUrl}/api/product/findAll`)
  },
  // 产品管理--修改
  saveProduct(data) {
    return axios.post(`${baseUrl}/api/product/update`, data)
  },
  // 产品管理--删除
  delProduct(data) {
    return axios.post(`${baseUrl}/api/product/delete/` + data)
  },
  //根据产线生成标签并打印
  createSilkBarCode(parms) {
    return axios.post(`${baseUrl}/api/code/createSilkBarCode/`, parms)
  },
  //查询丝锭标签
  selectAllSilkBarCode(parms) {
    return axios.post(`${baseUrl}/api/code/selectAllSilkBarCode/`, parms)
  },
  //增加字典
  addDict(parms) {
    return axios.post(`${baseUrl}/api/dictionary/addDict`, parms)
  },
  //查询字典
  getAllDict() {
    return axios.get(`${baseUrl}/api/dictionary/getAllDict`)
  },
  //删除
  deleteDict(parms) {
    return axios.post(`${baseUrl}/api/dictionary/deleteDict/${parms}`)
  },
  //字典通过建获取值
  getDict(parms) {
    return axios.get(`${baseUrl}/api/dictionary/getDict/${parms}`)
  },
  // 丝车管理--获取数据
  getSilks(page, size, data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCar/findAll/' + page + '/' + size, data)
  },

  // 丝车管理--添加
  addSilks(data) {
    return axios.post(baseUrl + '/api/silkCar/add', data)
  },

  // 批号管理--获取数据
  getBatches(params) {
    return axios.post(baseUrl + '/api/batch/getBatchsPage', params)
  },
  // 批号管理--add
  addBatch(params) {
    return axios.post(baseUrl + '/api/batch/addBatch', params)
  },
  // 批号管理--update
  SaveBatches(params) {
    return axios.post(baseUrl + '/api/batch/updateBatch', params)
  },
  // 通知单--获取数据
  getNotices(params) {
    return axios.post(baseUrl + '/api/notify/getNotifys', params)
  },
  // 通知单--add
  addNotices(data) {
    return axios.post(baseUrl + '/api/notify/addNotify', data)
  },

  // 通知单--修改通知单
  saveNotice(data) {
    return axios.post(baseUrl + '/api/notify/updateNotify', data)
  },

  // 通知单--执行详情
  getPerforms(data) {
    return axios.post(baseUrl + '/api/notify/getNotifyDetail', data)
  },
  // 执行单个exeNotices
  exeNotices(data) {
    return axios.post(baseUrl + '/api/notify/doNotify', data)
  },

  // 执行单个exeNotices
  unExe(data) {
    return axios.post(baseUrl + '/api/notify/cancelNotify', data)
  },
  //丝锭异常获取所有
  silkExceptions() {
    return axios.get(baseUrl + '/api/silkException/findAll')
  },
  //丝锭异常获取所有add
  addsilkExceptions(data) {
    return axios.post(baseUrl + '/api/silkException/add', data)
  },
  //修改丝锭异常获取所有
  updateSilkException(data) {
    return axios.post(baseUrl + '/api/silkException/update', data)
  },
  //del丝锭异常获取
  delExcepById(data) {
    return axios.post(baseUrl + '/api/silkException/delete/' + data)
  },

  //丝锭异常note获取所有
  silkNoteExceptions() {
    return axios.get(baseUrl + '/api/silkNote/findAll')
  },
  //丝锭异常获取所有add
  addNoteExceptions(data) {
    return axios.post(baseUrl + '/api/silkNote/add', data)
  },

  //del丝锭异常获取
  delExcepNoteById(data) {
    return axios.post(baseUrl + '/api/silkNote/delete/' + data)
  },

  //修改丝锭异常note获取所有
  updateNoteSilkException(data) {
    return axios.post(baseUrl + '/api/silkNote/update', data)
  },

  // 获取所有等级
  getGrades() {
    return axios.get(baseUrl + '/api/grade/all')
  },
  AddGrades(data) {
    return axios.post(baseUrl + '/api/grade/add', data)
  },
  SaveGrades(data) {
    return axios.post(baseUrl + '/api/grade/edit', data)
  },
  // 获取在机生产计划
  getLinePlans(data) {
    return axios.post(baseUrl + '/api/productPlan/getInProductPlans', data)
  },
  // 丝车: 获取丝车详情
  getSilkss(code) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCarOnline/get/' + code)
  },
  // 根据丝车编号获取丝车信息
  findCarBySilkCarCode(code) {
    return axios.get(baseUrl + '/api/silkCar/findCarBySilkCarCode/' + code)
  },
  // 根据机台获取废丝
  getWasteSilk(code) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/doff/getMqDoffMessageExcludeFullVolume', code)
  },
  // 丝车: 解绑
  silkUnbind(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCarOnline/separate', data)
  },
  // 删除
  deleteMqDoffMessageExcludeFullVolume(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/doff/deleteMqDoffMessageExcludeFullVolume', data)
  },
  // 丝车: 定等
  dingDeng(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCarOnline/graded', data)
  },
  // 丝车: 拼车
  poolSilkCar(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/carPool/silkCarPooling', data)
  },

  // 丝车: 强制拼车
  ForceSilkCarPool(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/carPool/outLineExcSilkPool', data)
  },
  // 丝车: 强制拼车
  newSilkCarPooling(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/carPool/newSilkCarPooling', data)
  },

  // 选择位置拼车
  ChoosePostionSilkCarPool(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/carPool/silkCarPooling', data)
  },
  // 落筒: 自动线人工落筒 扫机台
  getSilkCarDoff(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/doff/getSilkCarDoffSpec', data)
  },
  // 落筒: 扫完机台获取位数
  getMqDoffMessage(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/doff/getMqDoffMessage', data)
  },
  // 落筒确定
  manualDoff(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/doff/manualDoff', data)
  },
  // 查询个人报表
  findReportWaiguan(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCarOnline/getOperateRecord', data)
  },
  // 丝车: 人工打包
  handPack(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/pack/handPack', data)
  },
  // 丝车: 暂存箱打包
  temporaryPack(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/pack/temporaryPack', data)
  },
  // 入暂存箱
  packInTemBox(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/pack/inTemporaryBox', data)
  },

  // 获取所有异常
  getAllExceptions() {
    // console.log("data" +  data.toString())
    return axios.get(baseUrl + '/api/silkException/findAll')
  },
  // 获取所有备注
  getAllSilkNote() {
    // console.log("data" +  data.toString())
    return axios.get(baseUrl + '/api/silkNote/findAll')
  },
  // 解绑撤销
  silkSeparateRecover(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCarOnline/silkSeparateRecover', data)
  },

  // printsilks
  printSilks(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/mqtttopic/pdaPrintSilks', data)
  },
  // 外观确认
  qualityProducts(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCarOnline/qualityProducts', data)
  },

  // 取消落筒
  canCleDoff(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCarOnline/silkCarRecover', data)
  },
  // pda打印
  print(line, silkCarCode) {
    // console.log("data" +  data.toString())
    return axios.get(baseUrl + '/api/mqtttopic/pdaPrint/' + line + '/' + silkCarCode)
  },

  // pda打印
  getMachineId(lineName, machineName) {
    // console.log("data" +  data.toString())
    return axios.get(baseUrl + '/api/machine/find/' + lineName + '/' + machineName)
  },

  // 查询合股丝机台
  findJoinSilkMachine(lineName) {
    // console.log("data" +  data.toString())
    return axios.get(baseUrl + '/api/machine/findJoinSilkMachin/' + lineName)
  },
  //追溯丝车信息
  findSilkInfo(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkReport/getSilkInfo', data)
  },
  // 扫丝车扫机台获取落筒规则+批号
  findDoffRule(data) {
    return axios.post(baseUrl + '/api/doffNew/findDoffRule', data)
  },
  // 获取落筒规则列表
  getRulesByBatchNo(data) {
    return axios.post(baseUrl + '/api/doffNew/getRulesByBatchNo', data)
  },
  // 保存落次
  newManualDoff(data) {
    return axios.post(baseUrl + '/api/doffNew/manualDoff', data)
  },
}
