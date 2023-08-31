import { createGlobalStyle } from 'styled-components';
import { AppColor } from './AppColor';

export const AppCommonStyle = createGlobalStyle`

.fc-point {
  color: ${AppColor.point}
}
.fs-small {
  font-size: 0.8em
}
`;
