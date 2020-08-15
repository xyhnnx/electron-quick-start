// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const path = require('path')
const os = require('os')
const fs = require('fs'); // 引入fs模块
const electron = require('electron')
const { ipcRenderer } = require('electron')
const { makeDir } = require('../../common/util')
const http = require("http");
const fetch = require('../../common/fetch')
const request = require('request')
const { timeOut } = require('../../common/util')
const config = require('../../common/config')
const {addDataToCloud}  = require('../../common/weixin-cloud')
function getAnswerItemInfo () {
  let $box = document.getElementsByClassName('QuestionAnswer-content')[0]
  let $info = $box.getElementsByClassName('AnswerItem')[0]
  let dataZop  = JSON.parse($info.getAttribute('data-zop'))
  let dataZaExtraModule = JSON.parse($info.getAttribute('data-za-extra-module'))
  let answerId = dataZop.itemId
  let questionName = dataZop.title
  let authorName = dataZop.authorName
  let questionId = dataZaExtraModule.card.content.parent_token
  // 点赞数
  let answerUpNum = dataZaExtraModule.card.content.upvote_num
  // NumberBoard-itemValue 问题关注数
  let questionFollowNum = document.getElementsByClassName('NumberBoard-itemValue')[0].getAttribute('title')
  let questionReadNum = document.getElementsByClassName('NumberBoard-itemValue')[1].getAttribute('title')
  let authorImg = $box.getElementsByClassName('AuthorInfo-avatar')[0].getAttribute('src')
  let authorBadgeText = $box.getElementsByClassName('AuthorInfo-badgeText')[0].innerText
  let answerImgList = []
  let imgDomlist = $box.getElementsByClassName('RichContent--unescapable')[0].getElementsByTagName('img')

  for(let i = 0;i<imgDomlist.length;i++) {
    let imgDomItem = imgDomlist[i]
    // 原始图片url
    let originalUrl = imgDomItem.getAttribute('data-original')
    if(originalUrl) {
      answerImgList.push(originalUrl)
    }
  }
  let saveData = {
    questionId,
    questionName,
    questionFollowNum, // 问题关注数
    questionReadNum, // 问题浏览量
    answerId,
    answerUpNum, // 回答点赞数
    answerImgList,
    authorName,
    authorImg,
    authorBadgeText,
  }
  return saveData
}
window.addEventListener('DOMContentLoaded', async () => {

});
window.addEventListener('scroll', async () => {
    let domList = document.getElementsByClassName('ContentItem-time')
    if(domList && domList.length) {
      for(let i = 0;i<domList.length;i++) {
        let boxItem = domList[i]
        let $aList = boxItem.getElementsByTagName('a')
        if($aList.length === 1) {
          boxItem.innerHTML += `<a target="_self" style="color: red;" href="${$aList[0].getAttribute('href')}">点击去收录该回答</a>`
        }
      }
    }
});
// 文件产出路径
const outputDir = `${config.outputDir}/zhuhu-img/`
makeDir(outputDir);


async function addAnswerImgToCloud () {
  let data = getAnswerItemInfo()
  if(Object.keys(data).length === 10 && data.answerImgList.length>5) {
    let res = await addDataToCloud({
      dbName: 'zhihuImgAnswer',
      primaryKey: 'answerId',
      list: [
        {
          ...data
        }
      ]
    })
    if(res && res.status === 0) {
      let msg = `成功${res.data.addCount?'添加':'更新'}一条回答，包含图片数据${data.answerImgList.length}条`
      alert(msg)
    } else {
      alert('weixin cloud 接口调用失败')
    }
  } else {
    alert('不满足添加条件')
  }
}
window.onload = async () => {
  if(window.location.href.includes('/answer/')) {
    // addAnswerImgToCloud()
    let btnBox = document.getElementsByClassName('QuestionButtonGroup')[0]
    btnBox.innerHTML = `
    <button type="button" id="xyh-add-answer" class="Button FollowButton Button--primary Button--blue">收录该作答</button>
    `
    document.getElementById('xyh-add-answer').onclick = () => {
      addAnswerImgToCloud()
    }
  } else {
    console.log('该页面不是回答详情页')
  }
};
window.addEventListener('keyup', (e => {
  console.log(e)
  if(e.key === 'F12') {
    ipcRenderer.send('callFunction', {
      functionName: 'toggleDevTools'
    })
  } else if(e.ctrlKey && e.key === 'o') {
    let input = window.document.createElement('input')
    input.placeholder = `请输入网址`
    window.document.getElementsByTagName('html')[0].insertBefore(input, document.getElementsByTagName('body')[0])
    input.onblur = () => {
      window.location.href = input.value
    }
  }
}), true)






