/*
@plugin 计时
@version 1.0
@author 做着名称
@link https://space.bilibili.com/124952089

@desc 一个脚本的描述说明
????????????
//创建了一个选项
@option 操作栏 {"开","关"} 
@alias #操作栏 {#开,#关} 

@lang zh
#操作栏 提示操作
#开 开始计时
#关 结束计时

@string 注释
@default '注释'
*/

export default class 自己的类 { //空开访问插件?
	onStart() { //脚本一开始就会运行
		this.秒数 = 0;
		this.计时器ID = null;
		console.log("计时插件已初始化并开启")
		
		
	}
	close_win() {
		clearTimeout(this.计时器ID);
		console.log("<"+String(this.注释) + ">计时器已经被取消结束了,总共运行" + this.秒数 + "秒");
	}
	open_win() {
		console.log("<"+String(this.注释)+">开始计时")
		this.秒数 = 0
		this.计时器ID = setInterval(() => {
			this.秒数++
			 //console.log(String(this.注释) + "计时器已经运行了 " + String(this.秒数) + " 秒");
		}, 1000); // 每隔1秒输出一次
	}
	call() {
		switch (this.操作栏) {
			case "关":
				return this.close_win()
			case "开":
				// console.log("触发1")
				return this.open_win()
		}
	}

}