import {inflateRawSync} from 'node:zlib';
export function readZip(bytes){
 let end=bytes.length-22;while(end>=Math.max(0,bytes.length-65557)&&bytes.readUInt32LE(end)!==0x06054b50)end--;
 if(end<0)throw new Error('ZIP end record not found');
 let offset=bytes.readUInt32LE(end+16);const result=[];
 for(let i=0;i<bytes.readUInt16LE(end+10);i++){
  if(bytes.readUInt32LE(offset)!==0x02014b50)throw new Error('Invalid ZIP central record');
  const method=bytes.readUInt16LE(offset+10),size=bytes.readUInt32LE(offset+20),nameLength=bytes.readUInt16LE(offset+28),extraLength=bytes.readUInt16LE(offset+30),commentLength=bytes.readUInt16LE(offset+32),local=bytes.readUInt32LE(offset+42);
  const name=bytes.subarray(offset+46,offset+46+nameLength).toString('utf8');
  const dataOffset=local+30+bytes.readUInt16LE(local+26)+bytes.readUInt16LE(local+28),compressed=bytes.subarray(dataOffset,dataOffset+size);
  if(![0,8].includes(method))throw new Error('Unsupported compression '+method);
  result.push([name,method===8?inflateRawSync(compressed):compressed]);offset+=46+nameLength+extraLength+commentLength;
 }
 return result;
}
