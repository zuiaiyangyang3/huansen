/*
@plugin #plugin
@version 1.0
@author Yami Sama
@link https://space.bilibili.com/124952089

@number angularSpeed
@alias #angularSpeed
@clamp -3600 3600
@default 90

@lang en
#plugin Trigger: Rotate Around the Caster
#angularSpeed Angular Speed

@lang zh
#plugin 触发器 - 绕技能施放角色旋转
#angularSpeed 角速度
*/

export default class RotateAroundCaster {
  trigger //:object
  caster  //:object
  casterX //:number
  casterY //:number

  onStart(trigger) {
    if (trigger instanceof Trigger) {
      this.trigger = trigger
      this.caster = trigger.caster
      this.casterX = this.caster.x
      this.casterY = this.caster.y
      this.angularSpeedRadians = Math.radians(this.angularSpeed) / 1000
    } else {
      this.update = Function.empty
    }
  }

  update() {
    const trigger = this.trigger
    const caster = this.caster
    // 计算相对于上一次角色位置的距离
    const distX = trigger.x - this.casterX
    const distY = trigger.y - this.casterY
    const dist = Math.sqrt(distX ** 2 + distY ** 2)
    const delta = this.angularSpeedRadians * trigger.deltaTime
    const angle = Math.atan2(distY, distX) + delta
    trigger.x = caster.x + Math.cos(angle) * dist
    trigger.y = caster.y + Math.sin(angle) * dist
    this.casterX = caster.x
    this.casterY = caster.y
  }
}