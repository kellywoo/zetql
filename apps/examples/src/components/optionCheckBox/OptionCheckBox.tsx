import styled from 'styled-components';
import { LocaleNumber } from '@ui/formats/localeNumber';
import { ProductOptionModel } from '@/models/Product.model';
import { ChangeEvent } from 'react';
import { AppColor } from '@ui/style/AppColor';

const Wrapper = styled.div``;

const FormRow = styled.label`
	padding: 1.25rem 1.5rem 1.25rem 1.25rem;
	flex: initial;
	color: ${AppColor.defaultText};
	border-radius: 4px;
	outline: none;
	display: flex;
	position: relative;
	width: 100%;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
	transition: background-color 0.4s;

	& + & {
		margin-top: 1rem;
	}
	&:hover {
		box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
	}
	&:active {
		background-color: ${AppColor.softGrayBg};
	}
`;
const FakeCheck = styled.span`
	width: 2.4rem;
	height: 2.4rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid ${AppColor.grayBg};
	border-radius: 5px;
	margin-right: 1.2rem;
	flex: none;
	padding-bottom: 0.25rem;
	&.is-active {
		background-color: #333;
		border-color: rgba(0, 0, 0, 0.1);
		&::before {
			content: '';
			width: 50%;
			height: 30%;
			border-left: 2px solid #fff;
			border-bottom: 2px solid #fff;
			transform: rotate(-50deg);
		}
	}
`;
const Label = styled.span`
	padding-top: 0.4rem;
	line-height: 1.6rem;
	flex: auto;
	min-width: 0;
`;
const Price = styled.span`
	padding-top: 0.4rem;
	line-height: 1.6rem;
	flex: none;
	margin-left: 1rem;
	font-size: 1.4rem;
	color: ${AppColor.point};
`;
const GhostCheckbox = styled.input`
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	cursor: pointer;
`;
export const OptionCheckBox = ({
	options,
	onChange,
	selected,
}: {
	options?: Array<ProductOptionModel>;
	onChange?: (set: Set<string>) => void;
	selected: Set<string>;
}) => {
	if (!options?.length) {
		return null;
	}
	return (
		<Wrapper>
			{options.map((option) => {
				return (
					<FormRow key={option.name}>
						<FakeCheck className={selected.has(option.name) ? 'is-active' : undefined} />
						<Label>{option.name}</Label>
						{option.price ? (
							<Price>
								+&nbsp;
								<LocaleNumber amount={option.price} />
							</Price>
						) : (
							<Price>무료</Price>
						)}
						<GhostCheckbox
							type={'checkbox'}
							value={option.price || 0}
							defaultChecked={false}
							onChange={(e: ChangeEvent<HTMLInputElement>) => {
								const checkedMarked = selected.has(option.name);
								const checked = !!e.target.checked;
								if (checked === checkedMarked) {
									return;
								}
								const set = new Set(selected);
								checked ? set.add(option.name) : set.delete(option.name);
								onChange?.(set);
							}}
						/>
					</FormRow>
				);
			})}
		</Wrapper>
	);
};
