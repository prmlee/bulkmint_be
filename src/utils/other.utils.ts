import { rootPath } from '../app';

export const getRootPath = (): string => {
  const temp = rootPath.split('\\');
  temp.pop();
  return temp.join('/');
};
