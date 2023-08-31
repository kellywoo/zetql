import { categoryList } from "../resource/db"

export const categoryApi = {
  url: "/categories",
  getHandler: (req) => {
    const data = categoryList

    return {
      data,
    }
  },
}

