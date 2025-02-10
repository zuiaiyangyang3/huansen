/*
@plugin #plugin
@version 1.0
@author Yami Sama
@link https://space.bilibili.com/124952089
@desc #desc

@option display {'windowed', 'maximized', 'fullscreen'}
@alias #display {#windowed, #maximized, #fullscreen}

@lang en
#plugin Set Display Mode
#desc Set the display mode of the application
#display Display
#windowed Windowed
#maximized Maximized
#fullscreen Fullscreen

@lang zh
#plugin 设置显示模式
#desc 设置应用的显示模式
#display 显示模式
#windowed 窗口模式
#maximized 窗口最大化
#fullscreen 全屏
*/

export default class SwitchHealthBar {
  call() {
    if (window.process) {
      const display = this.display
      // 游戏中的display命名不正确，暂时修改为旧值
      Data.config.window.display = display === 'windowed' ? 'window' : display
      const path = File.route('Data/config.json')
      const json = JSON.stringify(Data.config, null, 2)
      require('fs').promises.writeFile(path, json)
      require('electron').ipcRenderer.send('set-display-mode', display)
    }
  }
}