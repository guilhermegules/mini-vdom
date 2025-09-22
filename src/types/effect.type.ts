export type Effect = {
  callback: () => void | (() => void);
  deps?: any[];
  prevDeps?: any[];
  cleanup?: () => void;
};
