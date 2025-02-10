/*
@plugin 写入任务描述
@version 1.0
@author 做着名称
@link https://baidu.com
@desc 简单的写入任务描述

@attribute 选择任务
@string 未接收任务描述
@desc 任务啊
@string 已完成任务描述
@string 解锁规则
@string 达成规则
@string 完成规则

@string 没有用的待复制规则提示
@default '需求等级&1'
@string 没有用的待复制规则提示2
@default '需求等级&5+杀敌数量&种子宝宝&3'
@string 没有用的待复制规则提示3
@default '需求道具&1001&2+完成任务&10002'


@option 选项 {true, false}

@string 出现true
@cond 选项 {true}
@string 出现true1
@cond 选项 {true}

@string 出现false
@cond 选项 {false}
@string 出现true2
@cond 选项 {false}


*/

export default class Plugin {
  onStart() {

  }
  async call() {
    console.log("获取插件::")
    console.log(PluginManager)
    console.log("选择的任务:")
    console.log(this.选择任务)
    console.log("枚举选择")
    console.log(this.任务枚举)
  }

}

