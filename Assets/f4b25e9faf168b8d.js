/*
@plugin #plugin
@version 1.0
@author Yami Sama
@link https://space.bilibili.com/124952089
@desc #desc

@option mode {'position', 'actor'}
@alias #mode {#mode-position, #mode-actor}

@position-getter position
@alias #position
@cond mode {'position'}

@actor-getter actor
@alias #actor
@cond mode {'actor'}

@color lightColor
@alias #lightColor
@default ffffffff

@number lightRadius
@alias #lightRadius
@clamp 0 100
@default 1

@number intensity
@alias #intensity
@clamp 0 1
@decimals 4

@number duration
@alias #duration
@clamp 1 60000
@default 1000

@number fadein
@alias #fadein
@clamp 0 10000

@number fadeout
@alias #fadeout
@clamp 0 10000

@lang en
#plugin Create Temp Point Light
#desc Render a point light at the location of the trigger
#mode Mode
#mode-position Specify Position
#mode-actor Bind Actor
#position Position
#actor Actor
#lightColor Light Color
#lightRadius Light Radius
#intensity Intensity
#duration Duration (ms)
#fadein Fadein (ms)
#fadeout Fadeout (ms)

@lang zh
#plugin 创建临时点光源
#desc 在触发器的位置渲染一个点光源
#mode 模式
#mode-position 指定位置
#mode-actor 绑定角色
#position 位置
#actor 角色
#lightColor 照明颜色
#lightRadius 照明半径
#intensity 强度
#duration 持续时间(ms)
#fadein 渐入时间(ms)
#fadeout 渐出时间(ms)
*/

export default class CreateTempPointLight {
  call() {
    if (!Scene.binding) return
    let target
    switch (this.mode) {
      case 'position':
        target = this.position
        break
      case 'actor':
        target = this.actor
        break
    }
    if (target) {
      const light = new SceneLight()
      const lightColor = Color.parseIntArray(this.lightColor)
      light.x = target.x
      light.y = target.y
      light.red = lightColor[0] * lightColor[3] / 255
      light.green = lightColor[1] * lightColor[3] / 255
      light.blue = lightColor[2] * lightColor[3] / 255
      light.range = this.lightRadius * 2
      light.intensity = this.intensity
      light.script.add(new LightScript(this))
      Scene.binding.lights.append(light)
    }
  }
}

class LightScript {
  actor = null
  elapsed = 0
  duration = 0
  fadein = 0
  fadeout = 0
  red = 0
  green = 0
  blue = 0

  constructor(manager) {
    this.duration = manager.duration
    this.fadein = manager.fadein
    this.fadeout = manager.fadeout
    if (manager.mode === 'actor') {
      this.actor = manager.actor
    }
  }

  onScriptAdd(light) {
    this.light = light
    this.red = light.red
    this.green = light.green
    this.blue = light.blue
  }

  update(deltaTime) {
    this.elapsed += deltaTime
    // 到期后从场景中移除光源
    if (this.elapsed >= this.duration) {
      const scene = Scene.binding
      Callback.push(() => {
        scene.lights.remove(this.light)
      })
    }
    // 计算渐入颜色
    if (this.fadein !== 0) {
      if (this.elapsed < this.fadein) {
        const opacity = this.elapsed / this.fadein
        this.light.red = this.red * opacity
        this.light.green = this.green * opacity
        this.light.blue = this.blue * opacity
      }
    }
    // 计算渐出颜色
    if (this.fadeout !== 0) {
      const fadeStart = this.duration - this.fadeout
      const elapsed = this.elapsed - fadeStart
      if (elapsed > 0) {
        const time = elapsed / this.fadeout
        const opacity = Math.max(1 - time, 0)
        this.light.red = this.red * opacity
        this.light.green = this.green * opacity
        this.light.blue = this.blue * opacity
      }
    }
    // 同步光源到角色的位置
    if (this.actor) {
      this.light.x = this.actor.x
      this.light.y = this.actor.y
    }
  }
}