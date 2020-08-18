// 考文件到console 运行ZhituScript.start()

class ZhituScript {
    static async start () {
        let data = this.getAnswerItemInfo()
        if(Object.keys(data).length === 11 && data.answerImgList.length>5) {
            let res = await this.addDataToCloud({
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

    static getAnswerItemInfo () {
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
        let $domBadgeText = $box.getElementsByClassName('AuthorInfo-badgeText')[0]
        let authorBadgeText = $domBadgeText && $domBadgeText.innerText
        let answerImgList = []
        let imgDomlist = $box.getElementsByClassName('RichContent--unescapable')[0].getElementsByTagName('img')
        let editTimeText = $box.getElementsByClassName('ContentItem-time')[0].getElementsByTagName('span')[0].innerText

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
            editTimeText
        }
        return saveData
    }

    static remoteJs (url, key) {
        return new Promise((resolve => {
            if (window[key]) {
                resolve()
            } else {
                let script = window.document.createElement('script')
                script.src = `${url}`
                window.document.getElementsByTagName('head')[0].appendChild(script)
                script.onload = () => {
                    resolve()
                }
            }
        }))
    }

// 云函数入口函数 142xyh753869
    static async addDataToCloud (event) {

        const env = 'test-xyh-zhitu'
        // 云函数入口文件
        let cloud;
        let db;
        const initFun = async () => {
            // 加载微信cloud js
            await this.remoteJs('https://res.wx.qq.com/open/js/cloudbase/1.0.0/cloud.js','cloud')
            cloud = window.cloud
            await cloud.init({
                env,
                appid: 'wxe935513823b55267'
            })
            if(!db) {
                db = cloud.database({
                    env
                })
            }
        }

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
}
