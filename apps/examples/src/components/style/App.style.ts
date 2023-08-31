import { createGlobalStyle } from 'styled-components';
import { TableClassNames } from '@ui/table/table.style.ts';

export const AppStyle = createGlobalStyle`
.default-table {
  .${TableClassNames.thead} {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #f8f8f8;
  }
  .${TableClassNames.tr} {
    gap: 10px;
  }
  .${TableClassNames.th} {
    padding: 16px 0;
    font-weight: 700;
  }
  .${TableClassNames.td} {
    padding: 10px 0;
  }
}
:root {
--throbber-bg-color: #f8f8f8;
--throbber-color: #ada3a3;
}
`;
