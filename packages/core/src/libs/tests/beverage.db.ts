export type Beverage = { name: string; description: string; price: number };
export type Menu = {
	menu: {
		beverages: Array<Beverage>;
		extras: Record<string, number>;
	};
	note: string;
};

export default Object.freeze(<Menu>{
	menu: {
		beverages: [
			{
				name: 'Coffee',
				description: 'A classic and bold blend of freshly ground Arabica beans, brewed to perfection.',
				price: 3.5,
			},
			{
				name: 'Cappuccino',
				description: 'A delicious combination of espresso, steamed milk, and a layer of frothy milk foam.',
				price: 4.0,
			},
			{
				name: 'Latte',
				description: 'Creamy and smooth espresso with steamed milk, topped with a touch of foam.',
				price: 4.25,
			},
			{
				name: 'Mocha',
				description: 'Rich espresso, velvety chocolate, and steamed milk, topped with whipped cream.',
				price: 4.5,
			},
			{
				name: 'Americano',
				description: 'A shot of espresso diluted with hot water, delivering a strong and smooth taste.',
				price: 3.75,
			},
			{
				name: 'Iced Coffee',
				description: 'Chilled coffee served over ice, a refreshing treat perfect for warm days.',
				price: 4.0,
			},
			{
				name: 'Hot Chocolate',
				description: 'Indulgent cocoa mixed with steamed milk, topped with whipped cream and chocolate shavings.',
				price: 4.25,
			},
			{
				name: 'Tea (Assorted Varieties)',
				description: 'A selection of premium teas, including black, green, herbal, and fruit-infused options.',
				price: 3.0,
			},
			{
				name: 'Iced Tea (Assorted Flavors)',
				description: 'Chilled and flavored teas served over ice, a delightful way to quench your thirst.',
				price: 3.5,
			},
			{
				name: 'Smoothie (Mixed Berry)',
				description: 'A refreshing blend of mixed berries, yogurt, and ice for a burst of fruity goodness.',
				price: 5.0,
			},
			{
				name: 'Fresh Squeezed Orange Juice',
				description: 'Pure and natural orange juice, made fresh to order for a healthy pick-me-up.',
				price: 4.5,
			},
			{
				name: 'Lemonade',
				description: 'A tangy and sweet lemonade, perfect for a sunny day or as a thirst quencher.',
				price: 3.75,
			},
			{
				name: 'Soda (Assorted Flavors)',
				description: 'A selection of sodas, including cola, lemon-lime, and root beer, served chilled.',
				price: 2.5,
			},
			{
				name: 'Sparkling Water',
				description: 'Refreshing and bubbly mineral water to cleanse your palate.',
				price: 2.0,
			},
			{
				name: 'Iced Latte',
				description: 'A chilled version of our classic latte, perfect for a coffee pick-me-up on hot days.',
				price: 4.5,
			},
		],
		extras: {
			'Espresso Shot': 1.0,
			'Soy or Almond Milk (Substitute)': 0.5,
			'Extra Flavor Syrup (Vanilla, Caramel, Hazelnut, etc.)': 0.75,
			'Whipped Cream': 0.5,
		},
	},
	note: 'Prices and menu items are subject to change without notice. Please inform us of any allergies or dietary restrictions.',
});
