import {VNode, VNodeData} from '../vnode';
import {Module} from './module';

export type On = {
  [N in keyof HTMLElementEventMap]?: (ev: HTMLElementEventMap[N]) => void
} & {
  [event: string]: EventListener
};

function invokeHandler(handler: any, vnode?: VNode, event?: Event): void {
  if (typeof handler === "function") {
    // call function handler
    handler.call(vnode, event, vnode);
  } else if (typeof handler === "object") {
    // call handler with arguments
    if (typeof handler[0] === "function") {
      // handler为数组的情况。 eg : handler = [fn,arg1,arg2]
      // 第一项为函数说明后面的项为想要传的参数
      // special case for single argument for performance
      if (handler.length === 2) {
        // 当长度为2的时候，用call，优化性能
        handler[0].call(vnode, handler[1], event, vnode);
      } else {
        // 组装参数，用 apply 调用
        var args = handler.slice(1);
        args.push(event);
        args.push(vnode);
        handler[0].apply(vnode, args);
      }
    } else {
      // call multiple handlers
      for (var i = 0; i < handler.length; i++) {
        invokeHandler(handler[i], vnode, event);
      }
    }
  }
}

// handleEvent 主要负责转发，去除 on 里面对应的事件处理函数，进行调用
function handleEvent(event: Event, vnode: VNode) {
  var name = event.type,  // e.g: click
      on = (vnode.data as VNodeData).on;

  // call event handler(s) if exists
  if (on && on[name]) { // on['click']
    invokeHandler(on[name], vnode, event);
  }
}

function createListener() {
  return function handler(event: Event) { // 这个闭包函数会作为 事件处理函数 绑定到元素上，当事件触发的时候会执行这个函数
    handleEvent(event, (handler as any).vnode);
  }
}

/**
 * 核心方法
 * @param oldVnode
 * @param vnode 
 */
function updateEventListeners(oldVnode: VNode, vnode?: VNode): void {
  var oldOn = (oldVnode.data as VNodeData).on,
      oldListener = (oldVnode as any).listener,
      oldElm: Element = oldVnode.elm as Element,
      on = vnode && (vnode.data as VNodeData).on,
      elm: Element = (vnode && vnode.elm) as Element,
      name: string;

  // optimization for reused immutable handlers
  if (oldOn === on) {
    return;
  }

  // remove existing listeners which no longer used
  if (oldOn && oldListener) {
    // if element changed or deleted we remove all existing listeners unconditionally
    if (!on) {
      for (name in oldOn) {
        // remove listener if element was changed or existing listeners removed
        oldElm.removeEventListener(name, oldListener, false);
      }
    } else {
      for (name in oldOn) {
        // remove listener if existing listener removed
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      }
    }
  }

  // add new listeners which has not already attached
  if (on) {
    // reuse existing listener or create new 
    // handler(event: Event)
    var listener = (vnode as any).listener = (oldVnode as any).listener || createListener();
    // update vnode for listener
    listener.vnode = vnode;

    // if element changed or added we add all needed listeners unconditionally
    if (!oldOn) {
      for (name in on) {
        // add listener if element was changed or new listeners added
        elm.addEventListener(name, listener, false);
      }
    } else {
      for (name in on) {
        // add listener if new listener added
        if (!oldOn[name]) {
          elm.addEventListener(name, listener, false);
        }
      }
    }
  }
}

export const eventListenersModule = {
  create: updateEventListeners,
  update: updateEventListeners,
  destroy: updateEventListeners
} as Module;
export default eventListenersModule;
