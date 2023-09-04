import styled from 'styled-components';
import { classnames } from '@ui/helpers/classnames.ts';

export interface DefaultButtonProp {
  block?: boolean;
  round?: boolean;
}

export const ButtonBase = styled.button.attrs(({ type }) => {
  return { type: type || 'button' };
})`
  display: inline-flex;
  cursor: pointer;
  user-select: none;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  outline: none;
  &.is-disabled,
  &:disabled {
    cursor: not-allowed;
    color: var(--color-white);
    background-color: var(--color-disabled);
    border-color: var(--color-disabled);
  }
`;

export const SquareButton = styled(ButtonBase).attrs<DefaultButtonProp>(
  ({ block, round }) => {
    return {
      className: classnames(block ? 'is-block' : '', round ? 'is-round' : ''),
    };
  }
)<DefaultButtonProp>`
  --button-height: 38px;
  display: inline-flex;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border-color: transparent;
  border-width: 1px;
  border-style: solid;
  text-align: center;
  transition-property: color, background-color, border-color;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--button-height);
  font-size: 14px;
  padding: 0 16px;
  &.is-block {
    display: flex;
    width: 100%;
  }
  &.bg-white {
    background-color: #fff;
    &.is-disabled,
    &:disabled {
      background-color: var(--color-disabled);
    }
  }
`;
