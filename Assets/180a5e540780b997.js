/*
@plugin #plugin
@version 1.2
@author Yami Sama
@link https://space.bilibili.com/124952089
@desc #desc

@file eventId
@alias #eventId
@filter event

@file animationId
@alias #animationId
@filter animation

@option showName {true, false}
@alias #showName {#showName-true, #showName-false}

@attribute-key nameAttr
@alias #nameAttr
@filter equipment

@attribute-key qualityKey
@alias #qualityKey
@filter equipment

@attribute-key motionKey
@alias #motionKey
@filter item

@enum-value defQuality
@alias #defQuality

@string iconLayer
@alias #iconLayer
@default 'icon'

@string[] formats
@alias #formats
@default [
  'common = <outline:000000><color:0>{name}',
  'rare = <outline:000000><color:1>{name}',
  'artifact = <outline:000000><color:2>{name}',
  'legendary = <outline:000000><color:3>{name}',
]

@number nameOffsetY
@alias #nameOffsetY
@default -16

@number inventorySize
@alias #inventorySize
@clamp 0 1000
@decimals 0

@number dropRange
@alias #dropRange
@clamp 0 8
@default 2

@number dropTime
@alias #dropTime
@clamp 0 1000
@default 333

@number attractionDistance
@alias #attractionDistance
@clamp 0 32
@default 4

@number initialSpeed
@alias #initialSpeed
@clamp 0 32
@default 10

@number acceleration
@alias #acceleration
@clamp 0 32
@default 20

@number initialDelay
@alias #initialDelay
@clamp 0 10000
@default 1000

@number lifeTime
@alias #lifeTime
@clamp 0 3600000
@default 0

@lang en
#plugin Drop Item
#desc
Create dropped items or equipments in the scene
Set the quality attribute of the item (string type)
The animation will automatically switch to the motion with the quality attribute value as its name
If the motion does not exist, it will switch to the default motion

When the item touches the actor, it will trigger the specified event
In case of item type, the following event properties are available.
Local variable: type = "item"
Event trigger Actor
Event trigger Item
In case of equipment type, the following event properties are available.
Local variable: type = "equipment"
Event trigger Actor
Event-trigger Equipment

Methods:
PluginManager.DropItem.drop(actor, item, range = def)

#eventId Picking Up Event
#animationId Dropped Item Anim
#showName Show Name
#showName-true Enabled
#showName-false Disabled
#nameAttr Name Attr
#qualityKey Quality Attr
#motionKey Special Anim Motion
#defQuality Default Quality
#iconLayer Icon Layer Name
#formats Name Format Map
#nameOffsetY Name Offset Y
#inventorySize Inventory Size
#dropRange Drop Range
#dropTime Drop Time(ms)
#attractionDistance Attraction Distance
#initialSpeed Initial Speed
#acceleration Acceleration
#initialDelay Initial Delay(ms)
#lifeTime Life Time(ms)

@lang zh
#plugin 掉落物品
#desc
在场景中创建掉落物品或装备对象
设置物品的品质属性(字符串类型)
动画会自动切换到以品质属性值为名称的动作
如果不存在该动作，将切换到默认动作

物品触碰角色时，会触发指定的事件
如果是物品类型，以下事件属性可用：
本地变量：type = "item"
事件触发角色
事件触发物品
如果是装备类型，以下事件属性可用：
本地变量：type = "equipment"
事件触发角色
事件触发装备

脚本方法:
PluginManager.DropItem.drop(actor, item, range = def)

#eventId 触发事件
#animationId 掉落物品动画
#showName 显示名称
#showName-true 开启
#showName-false 关闭
#nameAttr 物品/装备名称属性
#qualityKey 物品/装备品质属性
#motionKey 物品特殊动作属性
#defQuality 默认品质
#iconLayer 动画图标图层名称
#formats 物品名称格式映射表
#nameOffsetY 物品名称偏移Y
#inventorySize 库存空间大小
#dropRange 掉落范围
#dropTime 掉落持续时间(毫秒)
#attractionDistance 吸引距离
#initialSpeed 初速度
#acceleration 加速度
#initialDelay 初始延迟时间(毫秒)
#lifeTime 生存时间(毫秒)
*/

const Formats = {}
let TextComponents = {}
let DefFormatKey = ''
let DefFormat = '{name}'
let NameKey = ''
let MotionKey = ''
let QualityKey = ''
let DefQuality = ''
let NameOffsetY = 0
let EventCommands = null
let InventorySize = 0
let DropRange = 0
let DropTime = 0
let AttractionDistance = 0
let InitialSpeed = 0
let Acceleration = 0
let InitialDelay = 0
let LifeTime = 0
const KEY = Symbol('DROPPED_ITEMS')
const NAME = Symbol('ITEM_NAME')
const {cos, sin, atan2, abs, min, roundTo, clamp, random, PI} = Math

// 掉落物品类
class DropItem {
  onStart() {
    // 侦听事件
    window.on('localize', () => {
      for (const text of Object.values(TextComponents)) {
        text.updateTextContent()
      }
    })
    window.on('rescale', () => {
      for (const text of Object.values(TextComponents)) {
        text.updatePrinter()
      }
    })
    Scene.on('load', scene => {
      const list = new DroppedWrapList()
      scene[KEY] = list
      list.cells.resize(scene)
      scene.updaters.push(list)
      // 如果显示装备名称
      if (this.showName) {
        scene.renderers.push(list)
      }
    })
    // 如果显示装备名称
    if (this.showName) {
      Scene.on('destroy', scene => {
        const components = Object.values(TextComponents)
        for (const component of components) {
          component.destroy()
        }
        TextComponents = {}
      })
    }

    // 获取动画数据，如果不存在，禁用drop方法
    this.animation = Data.animations[this.animationId]
    if (!this.animation) this.drop = Function.empty

    // 设置物品名称格式映射表
    for (const entry of this.formats) {
      const i = entry.indexOf('=')
      if (i !== -1) {
        const key = entry.slice(0, i).trim()
        const format = entry.slice(i + 1).trim()
        Formats[key] = format
        // 设置第一个格式为默认值
        if (!DefFormatKey) {
          DefFormatKey = key
          DefFormat = format
        }
      }
    }

    // 设置参数到外部变量
    NameKey = this.nameAttr
    MotionKey = this.motionKey
    QualityKey = this.qualityKey
    DefQuality = this.defQuality
    NameOffsetY = this.nameOffsetY
    EventCommands = EventManager.guidMap[this.eventId]
    InventorySize = this.inventorySize > 0 ? this.inventorySize : Infinity
    DropRange = this.dropRange
    DropTime = this.dropTime
    AttractionDistance = this.attractionDistance
    InitialSpeed = this.initialSpeed
    Acceleration = this.acceleration
    InitialDelay = this.initialDelay
    LifeTime = this.lifeTime
  }

  // 掉落物品或装备
  drop(actor, item, range = DropRange) {
    if (Scene.binding === null) return
    const animation = new Animation(this.animation)
    const specialMotion = item.attributes[MotionKey]
    // 优先切换到特殊动作
    if (typeof specialMotion === 'string') {
      animation.setMotion(specialMotion)
    }
    if (!animation.motion) {
      const qualityMotion = item.attributes[QualityKey]
      // 切换到品质对应的动作
      if (typeof qualityMotion === 'string') {
        animation.setMotion(qualityMotion)
      }
    }
    // 切换到默认动作
    if (!animation.motion) {
      animation.setMotion(DefQuality)
    }
    // 不存在默认动作，返回
    if (!animation.motion) return
    const layerName = this.iconLayer
    for (const {layer} of animation.contexts) {
      // 查找动画图标图层
      if (layer.name === layerName && layer.class === 'sprite') {
        const key = layer.sprite
        const guid = item.icon
        if (key !== '' && guid !== '') {
          // 设置精灵图和纹理采样区域
          animation.images[key] = guid
          animation.loadTexture(key)?.on('load', texture => {
            Callback.push(() => {
              const {clip} = item
              texture.x = clip[0]
              texture.y = clip[1]
              texture.width = clip[2]
              texture.height = clip[3]
            })
          })
        }
        break
      }
    }
    const wrap = new DroppedWrap(actor, item, animation)
    if (range > 0) {
      const angle = random() * PI * 2
      const dist = random() * range
      const x = dist * cos(angle)
      const y = dist * sin(angle)
      wrap.translate(x, y)
    }
  }
}

// 掉落物品包装列表类
class DroppedWrapList extends Array {
  cells           //:array
  activeItems     //:array

  constructor() {
    super()
    this.cells = new SceneGridCellList()
    this.activeItems = []
  }

  // 更新数据
  update(deltaTime) {
    let i = this.length
    while (--i >= 0) {
      this[i].update(deltaTime)
    }
    const activeItems = this.activeItems
    const player = Party.player
    if (player?.active) {
      const {x, y} = player
      if (player.inventory.size < InventorySize) {
        // 检查玩家周围的物品
        const r = AttractionDistance
        const cells = this.cells.get(x - r, y - r, x + r, y + r)
        const count = cells.count
        for (let i = 0; i < count; i++) {
          const cell = cells[i]
          for (let i = cell.length - 1; i >= 0; i--) {
            const wrap = cell[i]
            if ((x - wrap.x) ** 2 + (y - wrap.y) ** 2 <= r * r) {
              // 从网格分区中移动到已激活物品列表中
              cell.splice(i, 1)
              activeItems.push(wrap)
            }
          }
        }
      }
      // 更新已激活的物品，朝角色移动
      const delta = deltaTime / 1000
      const accel = Acceleration * delta
      let i = activeItems.length
      while (--i >= 0) {
        const wrap = activeItems[i]
        if (!wrap.active) {
          continue
        }
        const distX = x - wrap.x
        const distY = y - wrap.y
        const angle = atan2(distY, distX)
        const speed = (wrap.speed += accel)
        const deltaX = roundTo(speed * cos(angle), 6) * delta
        const deltaY = roundTo(speed * sin(angle), 6) * delta
        // 如果玩家角色在当前帧移动范围内，则触发事件并销毁物品包装
        if (abs(distX) <= abs(deltaX) && abs(distY) <= abs(deltaY)) {
          activeItems.splice(i, 1)
          if (player.inventory.size < InventorySize) {
            // 如果角色库存中有多余的空间
            // 触发事件并销毁物品包装
            if (EventCommands) {
              const {item} = wrap
              const event = new EventHandler(EventCommands)
              event.triggerActor = player
              if (item instanceof Item) {
                event.attributes.type = 'item'
                event.triggerItem = item
              } else if (item instanceof Equipment) {
                event.attributes.type = 'equipment'
                event.triggerEquipment = item
              }
              EventHandler.call(event, player.updaters)
            }
            wrap.destroy()
          } else {
            // 如果角色库存空间不足
            // 将正在移动中的物品放回网格分区中
            wrap.speed = InitialSpeed
            this.cells.append(wrap)
          }
        } else {
          // 将物品的位置加上当前帧移动距离
          wrap.x += deltaX
          wrap.y += deltaY
        }
      }
    } else if (activeItems.length !== 0) {
      // 如果不存在玩家角色或未激活
      // 将正在移动中的物品放回网格分区中
      for (const wrap of activeItems) {
        wrap.speed = InitialSpeed
        this.cells.append(wrap)
      }
      activeItems.length = 0
    }
  }

  // 渲染名字
  render() {
    // 使用已经排序的可视动画列表来渲染名字
    const animations = Scene.visibleAnimations
    const count = animations.count
    for (let i = 0; i < count; i++) {
      const animation = animations[i]
      const key = animation[KEY]
      if (key !== undefined) {
        const wrap = animation.position
        let text = TextComponents[key]
        if (text === undefined) {
          const name = animation[NAME]
          const quality = wrap.item.attributes[QualityKey]
          const format = Formats[quality] ?? DefFormat
          const content = format.replace('{name}', name)
          text = new TextComponent(content)
          TextComponents[key] = text
        }
        const point = Camera.convertToScreenCoords(wrap)
        text.x = point.x
        text.y = point.y + NameOffsetY * Camera.zoom
        text.draw()
      }
    }
  }
}

// 掉落物品包装类
class DroppedWrap {
  x         //:number
  y         //:number
  speed     //:number
  cellId    //:number
  active    //:boolean
  item      //:object
  animation //:object
  elapsed   //:number
  update    //:function

  constructor(actor, item, animation) {
    this.x = actor.x
    this.y = actor.y
    this.speed = InitialSpeed
    this.cellId = null
    this.active = false
    this.item = item
    this.animation = animation
    this.elapsed = 0
    this.update = DroppedWrap.wait
    animation.setPosition(this)
    Scene.binding[KEY].push(this)
    Scene.animations.append(animation)
  }

  // 平移相对的位置
  translate(x, y) {
    this.sx = this.x
    this.sy = this.y
    // 避免移动到场景外面
    // 如果场景宽高是4的倍数
    // 物品掉在右或下边缘将处于分区外，因此减去0.01
    const {width, height} = Scene.binding
    this.ex = clamp(this.x + x, 0, width - 0.01)
    this.ey = clamp(this.y + y, 0, height - 0.01)
  }

  // 添加到分区
  appendToCell() {
    if (this.cellId === null) {
      Scene.binding[KEY].cells.append(this)
      const {attributes} = this.item
      const name = attributes[NameKey]
      if (typeof name === 'string') {
        const quality = attributes[QualityKey]
        const prefix = quality in Formats ? quality : DefFormatKey
        this.animation[KEY] = prefix + ':' + name
        this.animation[NAME] = name
      }
    }
  }

  // 销毁
  destroy() {
    Scene.binding[KEY].remove(this)
    Scene.binding[KEY].cells.remove(this)
    Scene.animations.remove(this.animation)
    this.animation.destroy()
  }

  // 静态 - 等待初始延迟结束
  static wait(deltaTime) {
    this.elapsed += deltaTime
    // 如果存在平移过渡
    if (this.ex !== undefined) {
      const time = min(this.elapsed / DropTime, 1)
      this.x = this.sx * (1 - time) + this.ex * time
      this.y = this.sy * (1 - time) + this.ey * time
      if (time === 1) {
        this.ex = undefined
        this.appendToCell()
      }
    }
    // 初始延迟结束，物品可以被玩家吸引
    if (this.elapsed >= InitialDelay) {
      this.appendToCell()
      this.active = true
      if (LifeTime !== 0) {
        // 如果设置了生存时间，设置更新函数为：销毁计时
        this.update = DroppedWrap.destructionTiming
      } else {
        // 否则，从更新列表中删除
        Scene.binding[KEY].remove(this)
      }
    }
  }

  // 静态 - 销毁计时
  static destructionTiming(deltaTime) {
    if ((this.elapsed += deltaTime) >= LifeTime) {
      this.destroy()
    }
  }
}

// 文本组件
class TextComponent {
  texture         //:object
  printer         //:object
  _content        //:string
  _rawContent     //:string
  size            //:number
  color           //:string
  font            //:string
  x               //:number
  y               //:number
  backX           //:number
  backY           //:number
  backWidth       //:number
  backHeight      //:number
  textOuterX      //:number
  textOuterY      //:number
  textOuterWidth  //:number
  textOuterHeight //:number

  constructor(content) {
    this.texture = null
    this.printer = null
    this.content = content
    this.size = 16
    this.color = 'ffffffff'
    this.font = ''
    this.x = 0
    this.y = 0
    this.backX = 0
    this.backY = 0
    this.backWidth = 0
    this.backHeight = 0
    this.textOuterX = 0
    this.textOuterY = 0
    this.textOuterWidth = 0
    this.textOuterHeight = 0
  }

  // 文本内容
  get content() {
    return this._content
  }

  set content(value) {
    this._rawContent = value
    this._content = Local.replace(value)
  }

  // 更新文本内容
  updateTextContent() {
    this.content = this._rawContent
  }

  // 更新文本
  update() {
    let printer = this.printer
    if (printer === null) {
      // 如果首次调用，创建打印机和纹理
      const texture = new Texture()
      printer = new Printer(texture)
      printer.sizes[0] = this.size
      printer.colors[0] = Color.parseCSSColor(this.color)
      printer.fonts[0] = this.font || Printer.font
      // printer.effects[0] = Printer.parseEffect(this.effect)
      this.texture = texture
      this.printer = printer
    }
    // 如果文本内容发生变化
    // 或者换行模式文本区域发生变化
    // 或者截断模式文本区域发生变化
    if (printer.content !== this.content) {
      // 重置打印机
      if (printer.content) {
        printer.reset()
      }
      // 打印文本
      printer.draw(this.content)
      this.calculateTextPosition()
    }
  }

  // 绘制图像
  draw() {
    // 更新文本
    this.update()

    // 绘制文本
    if (this.content) {
      GL.fillRect(
        this.x + this.backX,
        this.y + this.backY,
        this.backWidth,
        this.backHeight,
        0x80000000,
      )
      GL.drawImage(
        this.texture,
        this.x + this.textOuterX,
        this.y + this.textOuterY,
        this.textOuterWidth,
        this.textOuterHeight,
      )
    }
  }

  // 计算文本位置
  calculateTextPosition() {
    const printer = this.printer
    if (printer !== null) {
      const BACK_PADDING = 2
      const pl = printer.paddingLeft / Printer.scale
      const pt = printer.paddingTop / Printer.scale
      const pr = printer.paddingRight / Printer.scale
      const pb = printer.paddingBottom / Printer.scale
      const outerWidth = this.texture.width / Printer.scale
      const outerHeight = this.texture.height / Printer.scale
      const innerWidth = outerWidth - pl - pr
      const innerHeight = outerHeight - pt - pb
      const backWidth = outerWidth - pl - pr + BACK_PADDING * 2
      const backHeight = outerHeight - pt - pb + BACK_PADDING * 2
      this.backX = -backWidth / 2 * UI.scale
      this.backY = -backHeight / 2 * UI.scale
      this.backWidth = backWidth * UI.scale
      this.backHeight = backHeight * UI.scale
      this.textOuterX = (-pl - innerWidth / 2) * UI.scale
      this.textOuterY = (-pt - innerHeight / 2) * UI.scale
      this.textOuterWidth = outerWidth * UI.scale
      this.textOuterHeight = outerHeight * UI.scale
    }
  }

  // 销毁元素
  destroy() {
    this.texture?.destroy()
  }
}

export default DropItem