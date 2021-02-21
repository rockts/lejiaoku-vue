// 格式化文件大小 单位：Bytes、KB、MB、GB
export function getReadableFileSizeString(fileSizeInBytes: number) {
 let i = -1;
 const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
 do {
  fileSizeInBytes = fileSizeInBytes / 1024;
  i++;
 } while (fileSizeInBytes > 1024);

 return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

// 资源类型 Icon 显示
// export function getFileTypeIcon() {}
