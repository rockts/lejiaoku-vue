// 格式化文件大小 单位：Bytes、KB、MB、GB
export function byteToText(size: number) {
 const mb = Math.floor(size / (1024 * 1024));
 const kb = Math.floor(size / 1024);
 if (mb > 0) {
  return (size / (1024 * 1024)).toFixed(2) + 'MB';
 } else if (kb > 0) {
  return (size / 1024).toFixed(2) + 'KB';
 } else {
  return size.toFixed(2) + 'B';
 }
}
