import React, { ReactElement, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { classnames } from "@ui/helpers/classnames.ts";

export const CssTransition = <S,>(
  props: {
    children: ReactElement
    animatePrefix?: string
    animateTs: number
    isOpen?: boolean
  } & S,
) => {
  const { animatePrefix = 'is', animateTs, children } = props
  const [isOpen, setOpen] = useState(false)
  const [className, setClassName] = useState(`${animatePrefix}-entering`)
  const [el, setEl] = useState<HTMLElement | null>(null)
  const refs = useRef({ el, animatePrefix, animateTs })
  refs.current = { el, animatePrefix: animatePrefix, animateTs }
  React.isValidElement(children)
  useImperativeHandle((children as any).ref, () => el)
  useLayoutEffect(() => {
    if (props.isOpen) {
      const timer: any[] = []
      setOpen(true)
      timer.push(
        setTimeout(() => {
          setClassName(`${animatePrefix}-entered`)
          timer.push(
            setTimeout(() => {
              setClassName('')
              // console.log('entered', el.classList.toString())
            }, animateTs),
          )
        }, 60),
      )
      return () => {
        timer.forEach(clearTimeout)
        const el = refs.current.el
        try {
          el!.classList.add(`${animatePrefix}-leaving`)
          setTimeout(() => {
            setOpen(false)
          }, animateTs - 60)
        } catch (e) {}
      }
    }
  }, [props.isOpen])
  if (!isOpen) {
    return null
  }
  return React.Children.only(
    React.cloneElement(children, {
      ...children.props,
      className: classnames(className, children.props.className),
      ref: setEl,
    }),
  )
}
CssTransition.displayName = 'CssTransition'
