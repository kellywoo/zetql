import styled from 'styled-components'
import { PropsWithChildren } from 'react'

const Wrapper = styled.div`
	min-height: 340px;
	max-height: 70vh;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`
const ImageBox = styled.div`
	margin-bottom: 10px;
	text-align: center;
`
const Comment = styled.div`
	text-align: center;
`
export const ContextualMessageBox = ({
	imgSrc,
	children,
	imgSize,
	className,
}: PropsWithChildren<{ imgSrc: string; imgSize?: number; className?: string }>) => {
	return (
		<Wrapper className={className} style={{ minHeight: imgSrc ? '340px' : '140px' }}>
			<div>
				{imgSrc && (
					<ImageBox>
						<img src={imgSrc} alt={'image illustration'} width={imgSize || 140} />
					</ImageBox>
				)}
				{children && <Comment>{children}</Comment>}
			</div>
		</Wrapper>
	)
}
