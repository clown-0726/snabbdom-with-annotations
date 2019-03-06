import {vnode, VNode, VNodeData} from './vnode';
export type VNodes = Array<VNode>;
export type VNodeChildElement = VNode | string | number | undefined | null;
export type ArrayOrElement<T> = T | T[];
export type VNodeChildren = ArrayOrElement<VNodeChildElement>
import * as is from './is';

// 这个函数是专门用来处理svg标签用的，对其添加命名空间用的。
function addNS(data: any, children: VNodes | undefined, sel: string | undefined): void {
  data.ns = 'http://www.w3.org/2000/svg';
  if (sel !== 'foreignObject' && children !== undefined) {
    for (let i = 0; i < children.length; ++i) {
      let childData = children[i].data;
      if (childData !== undefined) {
        addNS(childData, (children[i] as VNode).children as VNodes, children[i].sel);
      }
    }
  }
}

export function h(sel: string): VNode;
export function h(sel: string, data: VNodeData): VNode;
export function h(sel: string, children: VNodeChildren): VNode;
export function h(sel: string, data: VNodeData, children: VNodeChildren): VNode;

export function h(sel: any, b?: any, c?: any): VNode {

  /**
   * 回忆一下vnode的参数： sel, data, children, text, elm, key
   * elm, key 这两个是内部添加的，children, text 只能有一个，当是文本节点就不需要子节点了，当有子节点的话，文本节点就包含在内了
   * 因此归纳来说，其实 h 函数的参数只有选择器，数据绑定和（子节点或文本节点）这三个就够了。
   */

  var data: VNodeData = {}, children: any, text: any, i: number;

  // 如果最后一个参数不为空，表示一定存在子节点
  // 三个参数的情况  sel , data , children | text
  if (c !== undefined) {
    data = b;
    if (is.array(c)) { children = c; } // 说明是元素子节点
    else if (is.primitive(c)) { text = c; } // 说明是文本节点
    else if (c && c.sel) { children = [c]; } // ？？？

    // 两个参数的情况 : sel , children | text
    // 两个参数的情况 : sel , data
  } else if (b !== undefined) {
    if (is.array(b)) { children = b; } // 说明是元素子节点
    else if (is.primitive(b)) { text = b; } // 说明是文本节点
    else if (b && b.sel) { children = [b]; } // ？？？
    else { data = b; } // 如果不是子节点，则表示是这个数据绑定了
  }

  // 如果子节点数组中，存在节点是原始类型，说明该节点是text节点，因此我们将它渲染为一个只包含text的VNode
  // 如果只是普通文本的话，可以省略不用 h 函数包裹，直接写text内容
  if (children !== undefined) {
    for (i = 0; i < children.length; ++i) {
      if (is.primitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
    }
  }

  // 用于处理svg标签用的
  if (
    sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
    (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
  ) {
    addNS(data, children, sel);
  }

  return vnode(sel, data, children, text, undefined);

};
export default h;
