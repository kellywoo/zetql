import { ReactNode } from 'react';
import { Slide, toast, ToastOptions, TypeOptions } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const simpleToast = (message: ReactNode, option?: ToastOptions) => {
  const type = option?.type as TypeOptions;
  const param: ToastOptions = {
    position: 'bottom-center',
    hideProgressBar: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: false,
    closeOnClick: true,
    transition: Slide,
    ...(option || {}),
    autoClose: option?.autoClose ?? 1000,
  };
  const content = typeof message === 'string' ? message.replace(/\n/g, ' ') : message;
  if (param.toastId && toast.isActive(param.toastId)) {
    toast.update(param.toastId, {
      ...param,
      toastId: undefined,
      render: content,
    });
  } else {
    toast(content, param);
  }
};
