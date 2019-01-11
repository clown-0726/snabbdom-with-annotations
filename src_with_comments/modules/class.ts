import {VNode, VNodeData} from '../vnode';
import {Module} from './module';

export type Classes = Record<string, boolean>

function updateClass(oldVnode: VNode, vnode: VNode): void {

  var cur: any, 
      name: string, 
      elm: Element = vnode.elm as Element,
      oldClass = (oldVnode.data as VNodeData).class,
      klass = (vnode.data as VNodeData).class;

  // 如果新节点的class和旧节点的class都不存在或者一样，则直接返回
  if (!oldClass && !klass) return;
  if (oldClass === klass) return;
  // ？？？
  oldClass = oldClass || {};
  klass = klass || {};

  /**
   * 
  class: {
    active: true,
    active1: false,
  }
  */

  // 先删除旧节点中在新节点中不存在的
  // 如果旧节点中的class不存在于新节点，则删除
  for (name in oldClass) {
    if (!klass[name]) {
      elm.classList.remove(name);
    }
  }

  // 更新剩下的
  // 判断新节点中class的状态是否是true或者false，根据这个状态执行 add 或 remove 方法
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      (elm.classList as any)[cur ? 'add' : 'remove'](name);
      // elm.classList.add('classname')
      // elm.classList.remove('classname')
    }
  }

}

export const classModule = {create: updateClass, update: updateClass} as Module;
export default classModule;
