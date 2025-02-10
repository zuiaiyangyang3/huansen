/*
@plugin 北京时间
@version 1.0
@author Yami Sama
@link https://space.bilibili.com/124952089

@desc  //一个脚本的说明
会将是否为调试模式设置到临时对象中

@string 临时对象ID
@default 'ff23e642af4413eb'

*/
const fs = require('fs');
//在点击开始游戏后,读档后会触发
export default class Plugin {//空开访问插件?
	onStart() {

		//
		if (fs.existsSync(__dirname+'/resources')) {
		  console.log('文件夹存在,正式模式');
		  Variable.set(this.临时对象ID, false)
		} else {
		  console.log('文件夹不存在,调试模式');
		  Variable.set(this.临时对象ID, true)
		  console.log(Variable.get(this.临时对象ID))
		  
		}
		
	}
}