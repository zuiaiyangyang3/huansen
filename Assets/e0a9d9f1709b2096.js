/*
@plugin #plugin
@version
@author Yami Sama
@link https://space.bilibili.com/124952089
@desc #desc

@number period
@alias #period
@clamp 200 4000
@default 640

@number opacity
@alias #opacity
@clamp 0 1
@default 0.5

@lang en
#plugin Button - Hover Image Transition
#desc Fade in and out when this button is selected in the latest focus.
#period Period(ms)
#opacity Opacity

@lang zh
#plugin 按钮 - 选中图片渐变
#desc 当这个按钮在最新的焦点中被选中时，淡入和淡出选中图片。
#period 周期(ms)
#opacity 不透明度
*/

export default class ButtonTransition {
  button
  state = 'normal'
  elapsed = 0
  opacityFactor = 1

  onStart(element) {
    if (element instanceof ButtonElement) {
      this.button = element
    } else {
      this.update = Function.empty
    }
  }

  update(deltaTime) {
    const state = this.button._displayMode
    if (this.state !== state) {
      this.state = state
      if (state !== 'hover') {
        this.elapsed = 0
      }
      this.opacityFactor = 1
      this.button.shadowImage.set({opacity: this.button.imageOpacity})
    }
    if (state === 'hover') {
      const focuses = UI.focuses
      const focus = focuses[focuses.length - 1]
      if (focus?.contains(this.button)) {
        const period = this.period
        const opacity = this.opacity
        const half = period / 2
        const elapsed = (this.elapsed + deltaTime) % period
        this.opacityFactor = Math.abs(elapsed - half) / half * (1 - opacity) + opacity
        this.button.shadowImage.set({opacity: this.button.imageOpacity * this.opacityFactor})
        this.elapsed = elapsed
      } else if (this.opacityFactor !== 1) {
        this.opacityFactor = 1
        this.button.shadowImage.set({opacity: this.button.imageOpacity})
        this.elapsed = 0
      }
    }
  }
}