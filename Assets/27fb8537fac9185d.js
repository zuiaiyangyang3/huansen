/*
@plugin 调试本地变量输出
@version 1.0
@author Yami Sama
@link https://space.bilibili.com/124952089
@desc #desc
@variable-getter 变量
*/

export default class Plugin {
  onStart() {

  }
  async call() {
    console.log(String(this.变量.get()))
  }

}