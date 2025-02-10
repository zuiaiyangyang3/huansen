/*
@plugin #plugin
@version 1.0
@author Yami Sama
@link https://space.bilibili.com/124952089

@number smoothFactor
@alias #smoothFactor
@clamp 1 4
@default 2

@lang en
#plugin Smooth Camera Follow
#smoothFactor Smooth Factor

@lang zh
#plugin 平滑相机跟随
#smoothFactor 平滑系数
*/

export default class SmoothCameraFollow {
  onStart() {
    let scene
    const flexFactor = 0.024
    const baseFactor = 0.0072 / this.smoothFactor
    const {clamp, dist} = Math
    Camera.createFollower = function () {
      const {target} = this
      return {
        update: deltaTime => {
          if (target.destroyed) {
            this.target = null
            this.updaters.deleteDelay('move')
            return
          }
          const {x: sx, y: sy} = this
          const {x: dx, y: dy} = target
          if (sx === dx && sy === dy) return
          // 切换场景时瞬移摄像机
          if (scene !== Scene.binding) {
            if (Scene.binding.actors.includes(target)) {
              scene = Scene.binding
              this.x = dx
              this.y = dy
            }
            return
          }
          // 动态调整平滑速度
          // 相机与目标距离较远时使用正常平滑速度
          // 较近时增加平滑速度抑制低速移动造成的抖动
          const {x: x1, y: y1} = Scene.convert(this)
          const {x: x2, y: y2} = Scene.convert(target)
          const ratio = clamp(
            deltaTime * flexFactor / dist(x1, y1, x2, y2),
            deltaTime * baseFactor,
            1,
          )
          this.x = sx * (1 - ratio) + dx * ratio
          this.y = sy * (1 - ratio) + dy * ratio
        }
      }
    }
  }
}