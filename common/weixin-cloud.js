const env = 'test-xyh'
// 云函数入口文件
let cloud;
let db;
const {remoteJs} = require('./util')
async function initFun () {
  // 加载微信cloud js
  await remoteJs('https://res.wx.qq.com/open/js/cloudbase/1.0.0/cloud.js','cloud')
  cloud = window.cloud
  await cloud.init({
    env,
    appid: 'wxdeca305114732d6e'
  })
  if(!db) {
    db = cloud.database({
      env
    })
  }
}
// 云函数入口函数 142xyh753869
exports.addDataToCloud = async (event) => {
  console.log(initFun,'initFuninitFuninitFun')
  await initFun()
  let addCount = 0
  let updateCount = 0
  // 数据库名称 数据库唯一标识（用于添加时判断是否存在） 要插入的数据List
  let {dbName, primaryKey, list} = event;
  if (list &&list.length) {
    for(let i = 0;i<list.length;i++) {
      // 查询该条记录是否存在
      let item = list[i];
      item.openId = item.openId || undefined
      item.createTime = new Date()
      let countRes
      if (primaryKey) { // 如果传来primaryKey；则先判断是否存在；不存在才添加
        countRes = await db.collection(dbName).where({
          [primaryKey]: item[primaryKey]
        }).count();
      } else { // 直接判定不存在
        countRes = {
          total: 0
        }
      }

      if(countRes.total === 0) {// 不存在则添加
        await db.collection(dbName).add({
          // data 字段表示需新增的 JSON 数据
          data: {
            ...item,
          }
        })
        addCount ++
      } else { // 有则修改
        console.log('-----有则修改----')
        await db.collection(dbName).where({
          [primaryKey]: item[primaryKey]
        }).update({
          data: {
            ...item
          }
        })
        updateCount ++
      }
    }
  }

  return {
    status: 0,
    data: {
      addCount,
      updateCount
    },
    message: '成功'
  }
}
