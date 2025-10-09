export type VNode = {
  type: string | Function;
  props: {
    [key: string]: any;
    children?: (VNode | string)[] | string;
  };
};
