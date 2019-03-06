import {VNode, VNodeData} from '../vnode';
import {Module} from './module';

export type Dataset = Record<string, string>;

const CAPS_REGEX = /[A-Z]/g;

function updateDataset(oldVnode: VNode, vnode: VNode): void {
  let elm: HTMLElement = vnode.elm as HTMLElement,
    oldDataset = (oldVnode.data as VNodeData).dataset,
    dataset = (vnode.data as VNodeData).dataset,
    key: string;

  // 如果新节点的 oldDataset 和旧节点的 oldDataset 都不存在或者一样，则直接返回
  if (!oldDataset && !dataset) return;
  if (oldDataset === dataset) return;
  oldDataset = oldDataset || {};
  dataset = dataset || {};
  const d = elm.dataset;

  // 删除多余的 dataset
  for (key in oldDataset) {
    if (!dataset[key]) {
      if (d) {
        if (key in d) {
          delete d[key];
        }
      } else {
        // 将驼峰式改为中划线分割  eg: userName ----> user-name
        elm.removeAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase());
      }
    }
  }
  
  // 修改有变化的 dataset
  for (key in dataset) {
    if (oldDataset[key] !== dataset[key]) {
      if (d) {
        d[key] = dataset[key];
      } else {
        // 将驼峰式改为中划线分割  eg: userName ----> user-name
        elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[key]);
      }
    }
  }
}

export const datasetModule = {create: updateDataset, update: updateDataset} as Module;
export default datasetModule;
