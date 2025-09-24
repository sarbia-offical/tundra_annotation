export type IndexSignature<K> = string extends K
  ? true
  : number extends K
  ? true
  : boolean extends K
  ? true
  : symbol extends K
  ? true
  : false;

// 移除索引签名
export type RemoveIndexSignature<T> = {
  [K in keyof T as IndexSignature<K> extends true ? never : K]: T[K];
};
