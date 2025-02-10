/*
@plugin
@version
@author
@link
@desc

@string 键
@alias #xKey
@default '怪物1'

@lang zh
#plugin 计次储存
#desc 地图标记插件的相关指令
#xKey 键 键值
*/
*/


export default class SetMapMarker {
  call() {
    const 键 = Event.attributes[this.xKey]
    if (typeof x === 'number') {
      PluginManager.MapMarker?.set(x)
    }
  }
}