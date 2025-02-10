/*
@plugin 写出任务属性
@version 1.0
@author 做着名称
@link https://baidu.com
@desc 简单的写入任务状态

@string 键

*/


export default class Plugin {
  onStart() {
    this.键="123"
  }
  async call() {
    console.log(this.键)

  }

}