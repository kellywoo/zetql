const coffeeTypes = [
  {
    categoryId: "cafe.coffee",
    productId: "1",
    name: "아메리카노",
    price: 1500,
    option: [
      {
        name: "연하게",
      },
      {
        name: "2샷",
        price: 500,
      },
    ],
  },
  {
    categoryId: "cafe.coffee",
    productId: "2",
    name: "헤이즐넛 아메리카노",
    price: 2000,
    option: [
      {
        name: "2샷",
        price: 500,
      },
    ],
  },
  {
    categoryId: "cafe.coffee",
    productId: "3",
    name: "허니 아메리카노",
    price: 2000,
    option: [
      {
        name: "2샷",
        price: 500,
      },
    ],
  },
  {
    categoryId: "cafe.coffee",
    productId: "4",
    name: "에스프레소",
    price: 1800,
  },
]

const milkteaTypes = [
  {
    categoryId: "cafe.milktea",
    productId: "5",
    name: "얼그레이 밀크티",
    price: 3000,
    option: [
      {
        name: "두유로 변경",
      },
      {
        name: "2샷",
        price: 500,
      },
    ],
  },
  {
    categoryId: "cafe.milktea",
    productId: "6",
    name: "얼그레이 버블티",
    price: 3500,
    option: [
      {
        name: "2샷",
        price: 500,
      },
      {
        name: "버블 추가",
        price: 1000,
      },
      {
        name: "두유로 변경",
      },
    ],
  },
  {
    categoryId: "cafe.milktea",
    productId: "7",
    name: "딸기라떼",
    price: 4500,
  },
  {
    categoryId: "cafe.milktea",
    productId: "8",
    name: "초코라떼",
    price: 3500,
  },
  {
    categoryId: "cafe.milktea",
    productId: "9",
    name: "녹차라떼",
    price: 3500,
  },
  {
    categoryId: "cafe.milktea",
    productId: "10",
    name: "흑임자라떼",
    price: 3500,
    option: [
      {
        name: "두유로 변경",
      },
    ],
  },
]

const juiceTypes = [
  {
    categoryId: "cafe.juice",
    productId: "11",
    name: "수박쥬스",
    price: 4000,
  },
  {
    categoryId: "cafe.juice",
    productId: "12",
    name: "딸기쥬스",
    price: 3500,
    option: [
      {
        name: "딸기 2배",
        price: 1000,
      },
    ],
  },
  {
    categoryId: "cafe.juice",
    productId: "13",
    name: "망고쥬스",
    price: 4500,
  },
  {
    categoryId: "cafe.juice",
    productId: "14",
    name: "복숭아쥬스",
    price: 3500,
  },
]

const dessertTypes = [
  {
    categoryId: "cafe.dessert",
    productId: "15",
    name: "딸기 마카롱",
    price: 2000,
  },
  {
    categoryId: "cafe.dessert",
    productId: "16",
    name: "초코 마카롱",
    price: 2000,
  },
  {
    categoryId: "cafe.dessert",
    productId: "17",
    name: "초코칩 쿠키",
    price: 1500,
  },
  {
    categoryId: "cafe.dessert",
    productId: "18",
    name: "아몬드 쿠키",
    price: 1500,
  },
]

export const categoryList = [
  {
    id: "cafe.coffee",
    name: "Coffee",
  },
  {
    id: "cafe.milktea",
    name: "Milk Tea",
  },
  {
    id: "cafe.juice",
    name: "Juice",
  },
  {
    id: "cafe.dessert",
    name: "Dessert",
  },
]

export const productList = [
  ...coffeeTypes,
  ...milkteaTypes,
  ...juiceTypes,
  ...dessertTypes,
]

export const couponList = [
  {
    id: "coupon_1",
    type: "amount",
    name: "금액 할인",
    price: 3000,
  },
  {
    id: "coupon_2",
    type: "rate",
    name: "비율 할인",
    price: 10,
  },
]


export const stock = {}
