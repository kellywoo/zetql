import { couponList } from "../resource/db"

export const couponApi = {
  url: "/coupons",
  getHandler: (req) => {
    const data = couponList

    return {
      data,
    }
  },
}

