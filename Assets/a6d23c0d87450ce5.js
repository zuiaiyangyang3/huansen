/*
@plugin 任务
@version 1.0
@author 做着名称
@link https://baidu.com

@desc 一个管理游戏任务的状态
-------注释开始-------
初始任务表  把属性表 向内置的任务表和任务填充 没有的话.不会影响读档后之类的东西 状态初始值为"0"
取任务状态    总之是获取任务状态的东西,丢到变量里
设置任务状态    利用枚举设置任务的状态
存档          写出任务表到指定位置
读档          从指定位置读档到任务表
取任务名称   从属性键ID.取出任务名称
重置      重置任务列表与状态,在返回标题会使用到?读档好像也需要先重置?
------注释结束---------

@option 操作选项 {"初始化任务表","取任务状态","设置任务状态","取任务名称","存档","读档","重置"}

@注释 初始化不需要其他东西,

@注释 ------------------------------取任务状态 --------------------------------
@option 下级选项 {"选择单一任务取状态","利用ID变量取任务状态"}
@cond 操作选项 {"取任务状态"}

@attribute 选择任务
@cond 下级选项 {"选择单一任务取状态"}
@variable-getter 存到变量
@cond 下级选项 {"选择单一任务取状态"}

@下级注释  -------利用ID变量取任务状态--------
@variable-getter 取任务状态_ID_变量
@alias ID变量
@desc 可利用循环ID高效取出状态
@cond 下级选项 {"利用ID变量取任务状态"}

@variable-getter 取任务状态_ID_置状态
@alias 存到任务状态变量
@desc 将取到的名称设置到哪个字符串变量
@cond 下级选项 {"利用ID变量取任务状态"}

@注释 -------------------------- 设置任务状态 -------------------------------
@attribute 选择设置任务
@cond 操作选项 {"设置任务状态"}
@enum 任务的枚举
@cond 操作选项 {"设置任务状态"}

@注释 ---------------------------档案存档到任务表-------------------------
@number 存档检索位置
@default -1
@desc 指定位置默认-1
@cond 操作选项 {"存档"}
@variable-getter 操作存档索引
@desc 可以写入检索元素,从这里开始存,但是存档检索位置请设置为-1
@cond 操作选项 {"存档"}

@注释 -------------------------------档案读取到任务表-------------------------
@number 读档检索位置
@default -1
@desc 指定位置默认-1
@cond 操作选项 {"读档"}
@variable-getter 操作读档索引
@desc 可以写入检索元素,从这里开始读,但是读档检索位置请设置为-1
@cond 操作选项 {"读档"}

@注释 ----------------------------------取任务名称的------------------
@variable-getter ID变量
@desc 利用循环任务列表属性键的ID值取出任务
@cond 操作选项 {"取任务名称"}
@variable-getter 存到任务名称变量
@desc 将取到的名称设置到哪个字符串变量
@cond 操作选项 {"取任务名称"}


*/

/**
 * 任务枚举
 * 0.未解锁
 * 1.已解锁未接收
 * 2.已接收,
 *  3.可完成.
 * 4.已完成
 **/
// var 任务枚举;
// (function (任务枚举) {
//     任务枚举[任务枚举["\u672A\u89E3\u9501"] = 0] = "\u672A\u89E3\u9501";
//     任务枚举[任务枚举["\u5DF2\u89E3\u9501\u672A\u63A5\u6536"] = 1] = "\u5DF2\u89E3\u9501\u672A\u63A5\u6536";
//     任务枚举[任务枚举["\u5DF2\u63A5\u6536"] = 2] = "\u5DF2\u63A5\u6536";
//     任务枚举[任务枚举["\u53EF\u5B8C\u6210"] = 3] = "\u53EF\u5B8C\u6210";
//     任务枚举[任务枚举["\u5DF2\u5B8C\u6210"] = 4] = "\u5DF2\u5B8C\u6210";
// })(任务枚举 || (任务枚举 = {}));


/**
 * 这是一个任务数据库.
 * @type {Object}
 */
var 任务数据库 = {
    "1000": {
        "任务名称": "出来炸到",
        "未接收任务描述": "在种子森林中，黑暗势力的魔法种子正在吸取其他神奇种子的力量，变得异常强大。你需要击败10个攻击性极强的种子宝宝，拯救整个种子森林。",
        "已完成任务描述": "你成功地击败了10个异常躁动的种子宝宝，化解了它们的攻击，并将它们引导回正常状态。你成为了种子森林的守护者，拯救了整个森林，为它带来了新的希望和繁荣。",
        "解锁规则": "需求等级&1+完成任务&10002&3+需求道具&1001&2+完成任务&10002",
        "达成规则": "需求等级&5+杀敌数量&种子宝宝&3+需求道具&1001&2+完成任务&10002",
        "奖励规则": "道具&0&2+经验&100"
    }
}

/**
 * 这是一个任务状态,储存任务进度,需要存档
 * @type {Object}
 */
var 任务状态 = {
    "1000": {"任务状态": "0", "任务完成时间": "-1"}
}

// /**
//  * 配置任务的描述,无序存档.也许和数据库有冲突,待填充
//  * @type {Object}
//  */
//const 任务描述 = {}
//


export default class 游戏任务 { //空开访问插件?


    onStart() { //脚本一开始就会运行

    }


    async call() {
        switch (this.操作选项) {
            case "初始化任务表":
                //循环属性变量 向任务状态 如果没有的话,就进行一个初始化值
                //也需要任务数据库 初始化
                //无论是读档前 还是读档后 好像都不会影响
                //配置属性=任务表
                let 属性表 = Attribute.groupMap["b76dcaac95a5d153"]//这是任务表
				console.log("任务表:",属性表)
                console.log("任务状态表:",任务状态)
                //循环表
                for (let key in 属性表) {
                    let 任务ID = String(key)

                    if (!任务状态.hasOwnProperty(key)) {
                        //初始一个任务的状态值,默认未解锁
                        任务状态[String(任务ID)] = {"任务状态": "0", "任务完成时间": "-1"}
                    }
                    if (!任务数据库.hasOwnProperty(key)) {
                        任务数据库[任务ID] = {
                            "任务名称": 属性表[key],
                            "未接收任务描述": "",
                            "已完成任务描述": "",
                            "解锁规则": "",
                            "达成规则": "",
                            "奖励规则": ""
                        }
                    }
                }
                 // console.log("初始化开始")
                 // console.log(任务状态)
                 // console.log(任务数据库)
                 // console.log("初始化完毕")
                break
            case "取任务状态":
                switch (this.下级选项) {
                    case "选择单一任务取状态":
                        let 任务id = String(this.选择任务["key"])
                        let 取任务状态 = String(任务状态[任务id].任务状态)
                        this.存到变量.set(取任务状态)
                        break
                    case "利用ID变量取任务状态":
                        let 利用ID变量取任务状态_任务id = String(this.取任务状态_ID_变量.get())
                        // console.log("取任务ID:",利用ID变量取任务状态_任务id)
                        // console.log("任务数据库:",任务数据库)

                        // console.log("进入表1:",任务状态[利用ID变量取任务状态_任务id])
                        // console.log("为什么会报错:",任务状态[利用ID变量取任务状态_任务id]["任务状态"])

                        let 利用ID变量取任务状态_取任务状态 = String(任务状态[利用ID变量取任务状态_任务id]["任务状态"])
                        // console.log("是这里错误吗:",利用ID变量取任务状态_取任务状态)

                        this.取任务状态_ID_置状态.set(利用ID变量取任务状态_取任务状态)


                        break
                }


                break
            case "设置任务状态":
                // console.log(this.选择设置任务)
                // console.log(this.任务的枚举)
                let 任务状态id = String(this.选择设置任务["key"])
                任务状态[任务状态id].任务状态 = this.任务的枚举.value

                console.log("设置任务状态表:",任务状态)
                break
            case "存档":
               // console.log(this.存档检索位置)
               // console.log(this.操作存档索引.get())
                let 准备储存存档的位置=-1
                if (this["存档检索位置"]!=-1){
                    准备储存存档的位置=this["存档检索位置"]
                }else if(String(this["操作存档索引"].get())!="undefined"){
                    准备储存存档的位置=this["操作存档索引"].get()
                }
                准备储存存档的位置=String(准备储存存档的位置)
               await 存档(任务数据库,"RenWuDate",准备储存存档的位置)
               await 存档(任务状态,"RenWuState",准备储存存档的位置)
               // console.log(任务数据库)
               // console.log("准备cc"+准备储存存档的位置+"任务档案位置")
                break
            case "读档":
               // console.log("开始调试中:")
              //  console.log(this["读档检索位置"])
              //  console.log(this["操作读档索引"].get())
                let 准备读取存档的位置=-1
                if (this["读档检索位置"]!=-1){
                    准备读取存档的位置=this["读档检索位置"]
                }else if(String(this["操作读档索引"].get())!="undefined"){
                    准备读取存档的位置=this["操作读档索引"].get()
                }
               准备读取存档的位置=String(准备读取存档的位置)
                let 读取的任务数据=await 读档("RenWuDate",准备读取存档的位置)
                let 读取的任务状态=await 读档("RenWuState",准备读取存档的位置)
                if (typeof 读取的任务数据=="undefined") {return}
                if (typeof 读取的任务状态=="undefined"){return}
                任务数据库=读取的任务数据
                任务状态=读取的任务状态
                //console.log("准备dd"+准备读取存档的位置+"任务档案位置")
                break
            case "取任务名称":
               // console.log(this.ID变量.get())
                let 取任务名称_任务id = String(this.ID变量.get())
                let 取任务名称 = String(任务数据库[取任务名称_任务id].任务名称)
                this.存到任务名称变量.set(取任务名称)

                break
            case "重置":
                任务状态={}
                任务数据库={}
                console.log("重置任务成功")
                break
            //return this.open_win()
        }
    }

}


/**
 * 保存游戏数据到文件
 * @param {Object} 数据 存档字典
 * @param {String} 文件名 一个文件名
 * @param {String} 存档编号 存档的位置编号
 * @returns {Promise<undefined>}
 */

function 存档(数据,文件名="renwu", 存档编号 = "") {

    const suffix = 文件名+存档编号//文件名?
    const data = 数据
    console.log(data)
    //const data = {"ccc":"ccccccccccccc"}
    // MacOS打包缺少写入权限，暂时改成web模式
    let shell = Stats.shell
    if (!Stats.debug && Stats.isMacOS()) {
        shell = 'web'
    }
    switch (shell) {
        case 'electron': {
            const saveDir = File.route('$/Save')
            //获取客户端路径
            const dataPath = File.route(`$/Save/save${suffix}.save`)
            //写入客户端的数据
            const dataText = JSON.stringify(data, null, 2)
            const fsp = require('fs').promises
            return fsp.stat(saveDir).catch(error => {
                // 如果不存在存档文件夹，创建它
                return fsp.mkdir('Save')
            }).then(() => Promise.all([
                // 异步写入元数据和存档数据
                //写入存档
                fsp.writeFile(dataPath, dataText).catch(error => {
                    console.warn(error)
                }),

            ]))
        }
        case 'web': {//向WEB写入文件
            const dataKey = `save${suffix}.save`
            return Promise.all([
                IDB.setItem(dataKey, data),
            ])
        }
    }
}


/**
 * 从文件中加载游戏数据
 * @param {String} 文件名 一个文件名
 * @param {string} 存档编号 存档的位置编号
 * @returns {Promise<Object>}
 */
async function 读档(文件名="renwu",存档编号) {
    const suffix = 文件名+存档编号//文件名?
    //待读取数据
    let data
    //判断是否是WEB
    let shell = Stats.shell
    if (!Stats.debug && Stats.isMacOS()) {
        shell = 'web'
    }
    switch (shell) {
        //是客户端
        case 'electron':
            // 推迟到栈尾执行
            await void 0
            try {
                // 同步读取存档数据文件
                const path = File.route(`$/Save/save${suffix}.save`)
                const json = require('fs').readFileSync(path)
                data = JSON.parse(json)
            } catch (error) {
                console.warn(error)
                return
            }
            break
        //是网页呢
        case 'web': {
            const key = `save${suffix}.save`
            data = await IDB.getItem(key)
            break
        }
    }
    //返回数据
    return data
}

//import { helperFunction } from './任务指令/写入任务描述.458497fe1552da88';
