import { Gutter } from 'antd/es/grid/row';

export const gutter_16_16: Gutter | [Gutter, Gutter] = [16, 16];
export const gutter_8_8: Gutter | [Gutter, Gutter] = [8, 8];

export const col_1_1_1_1 = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
};

export const col_1_1_2_2 = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
};

export const col_1_1_2_3 = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 8,
};

export const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 5 },
    md: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 19 },
    md: { span: 20 },
  },
};
