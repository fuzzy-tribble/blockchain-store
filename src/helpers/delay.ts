export const delay = (ms: number, returnValue: any = true): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(returnValue);
    }, ms);
  });
};
