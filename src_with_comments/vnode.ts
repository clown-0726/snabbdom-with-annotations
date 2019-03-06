import {Hooks} from './hooks';
import {AttachData} from './helpers/attachto'
import {VNodeStyle} from './modules/style'
import {On} from './modules/eventlisteners'
import {Attrs} from './modules/attributes'
import {Classes} from './modules/class'
import {Props} from './modules/props'
import {Dataset} from './modules/dataset'
import {Hero} from './modules/hero'

export type Key = string | number;

export interface VNode {
  sel: string | undefined; // 选择器
  data: VNodeData | undefined; // 数据的绑定,可以有以下类型：attribute、props、eventlistner、class、dataset、hook
  children: Array<VNode | string> | undefined; // 子vnode
  elm: Node | undefined; // 对真实dom的引用
  text: string | undefined; // 节点文本数据
  key: Key | undefined; // key , 唯一值，为了优化性能
}

export interface VNodeData {
  // 属性 能直接用 . 访问的
  props?: Props;
  // 属性
  attrs?: Attrs;
  // 样式类
  class?: Classes;
  // 样式
  style?: VNodeStyle;
  // 数据
  dataset?: Dataset;
  // 绑定的事件
  on?: On;

  hero?: Hero;
  attachData?: AttachData;
  // 钩子
  hook?: Hooks;
  key?: Key;
  ns?: string; // for SVGs
  fn?: () => VNode; // for thunks
  args?: Array<any>; // for thunks
  [key: string]: any; // for any other 3rd party module
}

export function vnode(sel: string | undefined,
                      data: any | undefined,
                      children: Array<VNode | string> | undefined,
                      text: string | undefined,
                      elm: Element | Text | undefined): VNode {
  // 如果data不为空，则取data.key作为当前node的唯一识别码
  let key = data === undefined ? undefined : data.key;
  return {sel: sel, data: data, children: children,
          text: text, elm: elm, key: key};
}

export default vnode;
