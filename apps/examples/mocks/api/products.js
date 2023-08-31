import { productList } from "../resource/db"

export const productApi = {
  url: "/products",
  getHandler: (req) => {
    const data = productList

    return {
      data,
    }
  },
}

