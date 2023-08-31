import { AppResetStyle } from "@ui/style/AppReset.style.ts";
import { AppCommonStyle } from "@ui/style/AppCommon.style.ts";
export * from './AppColor.ts';
export const AppBaseStyle = ()=>{
  return <>
    <AppResetStyle/>
    <AppCommonStyle/>
  </>
}
