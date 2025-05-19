export default function deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => {
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        return obj1[key].length === obj2[key].length && 
               obj1[key].every((item: any, i: number) => deepEqual(item, obj2[key][i]));
      }
      return deepEqual(obj1[key], obj2[key]);
    });
  }