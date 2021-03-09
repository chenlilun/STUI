const fs = require('fs')
const path = require('path')

function getDirFiles(dir, fileList = []) {
  let files = fs.readdirSync(dir)
  files.forEach((v) => {
    let filePath = path.join(dir, v)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      getDirFiles(filePath, fileList)
    } else {
      let fileContent = fs.readFileSync(filePath).toString()
      let file = {
        fullPath: path.join(dir, v),
      }
      if (fileContent.indexOf('meta-requireAuth') > -1) {
        file.requireAuth = true
      }
      if (fileContent.indexOf('meta-keepAlive') > -1) {
        file.keepAlive = true
      }
      fileList.push(file)
    }
  })
  return fileList
}

let files = getDirFiles('./views')
let homeNavs = ''
let importList = []
let routes = []
files.forEach((v) => {
  let { fullPath, requireAuth, keepAlive } = v
  let filename = path.basename(fullPath, '.vue')
  let url = fullPath
    .replace(/\\/g, '/')
    .replace('views', '')
    .replace('.vue', '')
  importList.push(`import ${filename} from '@/${fullPath.replace(/\\/g, '/')}'`)
  let route =
    `    { 
      path: '${url === '/Home' ? '/' : url}', 
      name: '${filename}', 
      component: ${filename}, \n` +
    (keepAlive
      ? `      meta: { 
        keepAlive: ${keepAlive} 
      }\n `
      : ' ') +
    `   }`
  routes.push(route)
  // 处理链接
  if (filename !== 'Home') {
    homeNavs += `    <p><a href="#${url}">${filename}</a></p> \n`
  }
})
let pageRouter = `// @ts-nocheck
import Vue from 'vue'
import Router from 'vue-router'
${importList.join('\n')}

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

let router = new Router({ 
  routes: [
${routes.join(',\n')}
  ] 
})

export default router
`
fs.writeFileSync('./router/index.js', pageRouter)

let pageHome = `<template>
  <div class="home">
${homeNavs} </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>`
fs.writeFileSync('./views/Home.vue', pageHome)
