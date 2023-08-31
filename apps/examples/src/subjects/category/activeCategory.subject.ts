import { createSubject } from '@zetql/react';

export const activeCategorySubject = createSubject<{
	selected: string;
	setSelected: (s: string) => void;
}>((set) => ({
	selected: '',
	setSelected: (id: string) => {
		set({ selected: id });
	},
}));
