import {VNode, VNodeData} from '../vnode';
import {Module} from './module';

export type Props = Record<string, any>;

function updateProps(oldVnode: VNode, vnode: VNode): void {
  var key: string, cur: any, old: any, elm = vnode.elm,
      oldProps = (oldVnode.data as VNodeData).props,
      props = (vnode.data as VNodeData).props;

  // 如果新节点的 props 和旧节点的 props 都不存在或者一样，则直接返回
  if (!oldProps && !props) return;
  if (oldProps === props) return;
  // ???
  oldProps = oldProps || {};
  props = props || {};

  // 先删除旧节点中在新节点中不存在的
  // 如果旧节点中的 prop 不存在于新节点，则删除
  for (key in oldProps) {
    if (!props[key]) {
      delete (elm as any)[key];
    }
  }

  // 更新剩下的
  // 得到新旧节点中具体的的 prop 的值
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== 'value' || (elm as any)[key] !== cur)) {
      (elm as any)[key] = cur;
    }
  }

}

export const propsModule = {create: updateProps, update: updateProps} as Module;
export default propsModule;