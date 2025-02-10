/*
@plugin #plugin
@version 1.0
@author Yami Sama
@link https://space.bilibili.com/124952089
@desc #desc

@option operation {
  'output-text',
  'output-local-variables',
  'output-local-variable',
  'output-global-variable',
  'output-self-variable',
  'output-actor',
  'output-skill',
  'output-state',
  'output-equipment',
  'output-item',
  'output-element',
}
@alias #operation {
  #output-text,
  #output-local-variables,
  #output-local-variable,
  #output-global-variable,
  #output-self-variable,
  #output-actor,
  #output-skill,
  #output-state,
  #output-equipment,
  #output-item,
  #output-element,
}

@string text
@alias #text
@cond operation {'output-text'}

@string key
@alias #key
@cond operation {'output-local-variable'}

@variable varId
@alias #varId
@cond operation {'output-global-variable'}

@actor-getter actor
@alias #actor
@cond operation {'output-actor'}

@option actorData {'instance', 'attributes', 'attribute'}
@alias #output {#output-instance, #output-attributes, #output-attribute}
@cond operation {'output-actor'}

@attribute-key actorAttr
@alias #attribute
@filter actor
@cond actorData {'attribute'}

@skill-getter skill
@alias #skill
@cond operation {'output-skill'}

@option skillData {'instance', 'attributes', 'attribute'}
@alias #output {#output-instance, #output-attributes, #output-attribute}
@cond operation {'output-skill'}

@attribute-key skillAttr
@alias #attribute
@filter skill
@cond skillData {'attribute'}

@state-getter state
@alias #state
@cond operation {'output-state'}

@option stateData {'instance', 'attributes', 'attribute'}
@alias #output {#output-instance, #output-attributes, #output-attribute}
@cond operation {'output-state'}

@attribute-key stateAttr
@alias #attribute
@filter state
@cond stateData {'attribute'}

@equipment-getter equipment
@alias #equipment
@cond operation {'output-equipment'}

@option equipmentData {'instance', 'attributes', 'attribute'}
@alias #output {#output-instance, #output-attributes, #output-attribute}
@cond operation {'output-equipment'}

@attribute-key equipmentAttr
@alias #attribute
@filter equipment
@cond equipmentData {'attribute'}

@item-getter item
@alias #item
@cond operation {'output-item'}

@option itemData {'instance', 'attributes', 'attribute'}
@alias #output {#output-instance, #output-attributes, #output-attribute}
@cond operation {'output-item'}

@attribute-key itemAttr
@alias #attribute
@filter item
@cond itemData {'attribute'}

@element-getter element
@alias #element
@cond operation {'output-element'}

@option elementData {'instance', 'attributes', 'attribute'}
@alias #output {#output-instance, #output-attributes, #output-attribute}
@cond operation {'output-element'}

@attribute-key elementAttr
@alias #attribute
@filter element
@cond elementData {'attribute'}

@lang en
#plugin Debug
#desc Output variable information for checking

@lang zh
#plugin 调试
#desc 输出变量信息以供检查
#operation 操作
#output-text 输出(文本)
#output-local-variables 输出(所有本地变量)
#output-local-variable 输出(本地变量)
#output-global-variable 输出(全局变量)
#output-self-variable 输出(独立变量)
#output-actor 输出(角色数据)
#output-skill 输出(技能数据)
#output-state 输出(状态数据)
#output-equipment 输出(装备数据)
#output-item 输出(物品数据)
#output-element 输出(元素数据)
#text 文本
#key 键
#varId 变量
#output 输出
#output-instance 实例
#output-attributes 所有属性
#output-attribute 指定属性
#attribute 属性
#actor 角色
#skill 技能
#state 状态
#equipment 装备
#item 物品
#element 元素
*/

export default class Debug {
  // info = null

  onStart() { // 打开开发者工具窗口 只一次
    if (!Stats.debug) {
      return
    }
    if (this.operation.includes('output')) {
      require('electron').ipcRenderer.send('open-devTools')
    }
  }
  call() {
    if (!Stats.debug) {
      return
    }
    // 打开开发者工具窗口
    // if (this.operation.includes('output')) {
    //   require('electron').ipcRenderer.send('open-devTools')
    // }
    // 调试操作分支
    switch (this.operation) {
      case 'output-text':
        return console.log(this.text)
      case 'output-local-variables':
        return console.log(Event.attributes)
      case 'output-local-variable':
        return console.log(Event.attributes[this.key])
      case 'output-global-variable':
        return console.log(Variable.get(this.varId))
      case 'output-self-variable':
        return console.log(SelfVariable.get(Event.selfVarId))
      case 'output-actor':
        return this.outputObjectData(this.actor, this.actorData, this.actorAttr)
      case 'output-skill':
        return this.outputObjectData(this.skill, this.skillData, this.skillAttr)
      case 'output-state':
        return this.outputObjectData(this.state, this.stateData, this.stateAttr)
      case 'output-equipment':
        return this.outputObjectData(this.equipment, this.equipmentData, this.equipmentAttr)
      case 'output-item':
        return this.outputObjectData(this.item, this.itemData, this.itemAttr)
      case 'output-element':
        return this.outputObjectData(this.element, this.elementData, this.elementAttr)
    }
  }

  // 输出对象数据
  outputObjectData(object, outputData, attrKey) {
    switch (outputData) {
      case 'instance':
        return console.log(object)
      case 'attributes':
        return console.log(object?.attributes)
      case 'attribute':
        return console.log(object?.attributes?.[attrKey])
    }
  }

  // 获取信息面板
  // getInfoPanel() {
  //   let {info} = this
  //   if (!info) {
  //     // 创建统计信息元素
  //     info = document.createElement('div')
  //     info.style.position = 'absolute'
  //     info.style.padding = '4px'
  //     info.style.right = '0'
  //     info.style.top = '0'
  //     info.style.font = '16px sans-serif'
  //     info.style.color = 'white'
  //     info.style.backgroundColor = 'rgba(0, 0, 0, 0.25)'
  //     info.style.pointerEvents = 'none'
  //     info.style.userSelect = 'none'
  //     info.style.whiteSpace = 'pre'
  //     info.textContent = 'fuck'
  //     let elapsed = 1000
  //     // 创建更新器
  //     info.updater = {
  //       update: () => {
  //         elapsed += Time.rawDeltaTime
  //         if (elapsed > 995) {
  //           elapsed = 0
  //           // 每秒刷新统计信息文本(可见对象数量只有在渲染时才能获取)
  //           info.textContent = `${GL.width}x${GL.height}`
  //           + `\nFPS ${Time.fps}`
  //           + `\nActors ${Scene.visibleActors.count}/${Scene.actors.length}`
  //           + `\nAnims ${Scene.visibleAnimations.count}/${Scene.animations.length}`
  //           + `\nTriggers ${Scene.visibleTriggers.count}/${Scene.triggers.length}`
  //           + `\nParticles ${Scene.particleCount}`
  //           + `\nElements ${UI.manager.count}`
  //           + `\nTextures ${GL.textureManager.count}`
  //         }
  //       }
  //     }
  //     // 开启：添加统计信息元素和渲染器
  //     this.info = info
  //     document.body.appendChild(info)
  //     // Game.updaters.add(info.updater)
  //     // 立即调用一次渲染方法
  //     // info.updater.update()
  //   }
  //   // 关闭：移除统计信息元素和渲染器
  //   // this.info = null
  //   // document.body.removeChild(info)
  //   // Game.updaters.remove(info.updater)
  //   return info
  // }
}