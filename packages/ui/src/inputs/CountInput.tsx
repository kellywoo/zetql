import React, { CSSProperties } from 'react';
import styled from 'styled-components';

const CountStyle = {
	Wrapper: styled.div`
		--size: 2.8rem;
		--font-size: 1.6rem;
		--font-color: #333;
		width: calc(var(--font-size) * 3.5 + var(--size) * 2);
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex: none;
		&.is-sub {
			--font-color: #808080;
		}
	`,
	Button: styled.button`
		width: var(--size);
		height: var(--size);
		background-color: var(--font-color);
		--color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		&::after {
			content: '';
			display: block;
			width: 50%;
			height: 1.5px;
			background-color: var(--color);
		}
		&.is-plus::before {
			content: '';
			display: block;
			position: absolute;
			width: 50%;
			height: 1.5px;
			background-color: var(--color);
			transform: rotate(-90deg);
		}
		&:disabled {
			cursor: default;
			background-color: var(--color);
			border: 1px solid var(--font-color);
			opacity: 0.5;
			&::before,
			&::after {
				background-color: var(--font-color);
			}
		}
	`,
	Count: styled.span`
		color: var(--font-color);
		font-size: var(--font-size);
		line-height: var(--size);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	`,
};
export const CountInput = ({
	count,
	increase,
	decrease,
	disabled,
	min,
	max,
	size,
	useSubColor,
	fontSize,
}: {
	count: number;
	increase?: () => void;
	decrease?: () => void;
	disabled?: boolean;
	min: number;
	max?: number | null | undefined;
	size?: string;
	useSubColor?: boolean;
	fontSize?: string;
}) => {
	const decreaseDisabled = typeof min === 'number' && count <= min;
	const increaseDisabled = typeof max === 'number' && count >= max;
	const style = { ['--font-size']: fontSize || '1.6rem', ['--size']: size || '2.4rem' } as CSSProperties;
	const className = [disabled ? 'is-disabled' : undefined, useSubColor ? 'is-sub' : undefined]
		.filter(Boolean)
		.join(' ');
	return (
		<CountStyle.Wrapper className={className} style={style}>
			<CountStyle.Button
				type={'button'}
				aria-label={'decrease'}
				onClick={decrease}
				disabled={decreaseDisabled || disabled}
			/>
			<CountStyle.Count>{count}</CountStyle.Count>
			<CountStyle.Button
				type={'button'}
				aria-label={'increase'}
				className={'is-plus'}
				onClick={increase}
				disabled={increaseDisabled || disabled}
			/>
		</CountStyle.Wrapper>
	);
};
