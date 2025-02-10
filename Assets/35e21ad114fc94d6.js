/*
@plugin
@version
@author
@link
@desc
*/

export default class Plugin {
  onStart() {
	  console.log("触发了吗")
  }
}


export class UIElementScript {
	// 更新事件
	update(deltaTime) {}

	// 自动执行事件
	onStart(element) {
		console.log("qidong???")
	}

	// 鼠标按下事件
	onMouseDown(element) {
		console.log("初始化成功???222");
	}

	// 左键按下事件
	onMouseDownLB(element) {
		console.log("初始化成功???333");
	}

	// 右键按下事件
	onMouseDownRB(element) {}

	// 鼠标弹起事件
	onMouseUp(element) {}

	// 左键弹起事件
	onMouseUpLB(element) {}

	// 右键弹起事件
	onMouseUpRB(element) {}

	// 鼠标移动事件
	onMouseMove(element) {}

	// 鼠标进入事件
	onMouseEnter(element) {}

	// 鼠标离开事件
	onMouseLeave(element) {}

	// 鼠标点击事件
	onClick(element) {}

	// 鼠标双击事件
	onDoubleClick(element) {}

	// 滚轮滑动事件
	onWheel(element) {}

	// 元素销毁事件
	onDestroy(element) {}
}