// type ColorSet = Record<string, number[]>
export class StyleHelper {
	randomColorSet: Array<{ bg: string; font: string }> = [
		{ bg: '#1d8bcc', font: '#fff' },
		{ bg: '#07a0bd', font: '#fff' },
		{ bg: '#1ebbda', font: '#fff' },
		{ bg: '#03b59a', font: '#fff' },
		{ bg: '#34ca8e', font: '#fff' },
		{ bg: '#71bf46', font: '#fff' },
		{ bg: '#a6ce39', font: '#222' },
		{ bg: '#0f9f00', font: '#222' },
		{ bg: '#ffca2c', font: '#222' },
		{ bg: '#f18230', font: '#222' },
		{ bg: '#ee3c61', font: '#fff' },
		{ bg: '#ff4885', font: '#fff' },
		{ bg: '#f55132', font: '#fff' },
		{ bg: '#7571cf', font: '#fff' },
		{ bg: '#702cac', font: '#fff' },
		{ bg: '#2b0381', font: '#fff' },
	];

	pastelColorSet: Array<string> = [
		'#97c1a9',
		// '#b7cfb7',
		'#cce2cb',
		// '#eaeaea',
		'#c7dbda',
		'#ffe1e9',
		'#fdd7c2',
		'#f6eac2',
		'#ffb8b1',
		'#f98f6b',
		'#ffdac1',
		'#e2f0cb',
		'#b5ead6',
		'#55cbcd',
		'#a3e1dc',
		// '#edeae5',
		'#ffebcc',
		'#9ab7d3',
		'#37bcfa',
		'#f5d2d3',
		'#f7e1d3',
		'#dfccf1',
		'#94a3fd',
	];
	// randomColorSet: Array<{ bg: string; font: string }> = [
	// 	{ bg: '#ffb79e', font: '#222' },
	// 	{ bg: '#ffc8b3', font: '#222' },
	// 	{ bg: '#f9bdbd', font: '#222' },
	// 	{ bg: '#eda2a7', font: '#222' },
	// 	{ bg: '#c18897', font: '#fff' },
	// 	{ bg: '#a0829a', font: '#fff' },
	// 	{ bg: '#ae899b', font: '#fff' },
	// 	{ bg: '#e8c4c6', font: '#222' },
	// 	{ bg: '#fde0df', font: '#222' },
	// 	{ bg: '#d1b3cb', font: '#222' },
	// 	{ bg: '#abdee6', font: '#fff' },
	// 	{ bg: '#d4f0f0', font: '#222' },
	// 	{ bg: '#8fcaca', font: '#222' },
	// 	{ bg: '#cce2cb', font: '#222' },
	// 	{ bg: '#b6cfb6', font: '#222' },
	// 	{ bg: '#97c1a9', font: '#222' },
	// 	{ bg: '#a2e1db', font: '#222' },
	// 	{ bg: '#55cbcd', font: '#222' },
	// 	{ bg: '#cbaacb', font: '#222' },
	// 	{ bg: '#b3b4d6', font: '#222' },
	// 	{ bg: '#ecd5e3', font: '#222' },
	// ]

	bgSoft = this.randomColorSet.map(({ bg }) => {
		const sliced = [];
		let i = 1;
		while (i < 7) {
			sliced.push(parseInt(bg.slice(i, i + 2), 16));
			i += 2;
		}
		return `rgba(${sliced}, 0.3)`;
	});
	// colorSetToRgb(prefix: string, set: ColorSet) {
	// 	return this.mixin(
	// 		prefix,
	// 		Object.keys(set).reduce((p, c) => {
	// 			p[c] = `rgb(${set[c]})`
	// 			return p
	// 		}, {} as { [key: string]: string }),
	// 	)
	// }

	mixin(prefix: string, obj: { [key: string]: string }) {
		const keys: Array<string> = Object.keys(obj);
		return keys.reduce<string>((p, key) => {
			return p + `--${prefix}-${this.camelToKebab(key)}: ${obj[key]};\n`;
		}, '');
	}

	camelToKebab(str: string) {
		let i = 0;
		let s = '';
		while (i < str.length) {
			const ch = str[i].toLowerCase();
			if (str[i] === ch) {
				s += ch;
			} else {
				s += '-' + ch;
			}
			i++;
		}
		return s;
	}

	private stringToHex(str: string) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		let colour = '';
		for (let i = 0; i < 3; i++) {
			const value = (hash >> (i * 8)) & 0xff;
			colour += ('00' + value.toString(16)).slice(-2);
		}
		return colour;
	}

	stringToColour(str: string) {
		return `#${this.stringToHex(str)}`;
	}

	stringToNumber(str: string) {
		return parseInt(this.stringToHex(str), 16);
	}

	stringToRandomColor(str: string) {
		const idx = parseInt(this.stringToHex(str), 16) % this.randomColorSet.length;
		return this.randomColorSet[idx];
	}
	stringToRandomPastelColor(str: string) {
		const idx = parseInt(this.stringToHex(str), 16) % this.pastelColorSet.length;
		return this.pastelColorSet[idx];
	}

	stringToBgSoft(str: string) {
		const idx = parseInt(this.stringToHex(str), 16) % this.randomColorSet.length;
		return this.bgSoft[idx];
	}

	private hexToNumber(n: string) {
		return parseInt(n, 16);
	}
	hexToRgb(str: string) {
		try {
			const body = str[0] === '#' ? str.slice(1) : str;
			if (body.length === 3) {
				return body.split('').map((s) => {
					return this.hexToNumber(s + s);
				});
			}
			if (body.length >= 6) {
				return [body.slice(0, 2), body.slice(2, 4), body.slice(4, 6)].map((s) => {
					return this.hexToNumber(s);
				});
			}
			throw 'wrong parameter';
		} catch (e) {
			return null;
		}
	}
	ellipsis(n: number, maxHeight?: number) {
		if (n <= 0) {
			return '';
		}
		if (n === 1) {
			return `
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;`;
		} else {
			return `
overflow: hidden;
text-overflow: ellipsis;
word-wrap: break-word;
display: -webkit-box;
-webkit-line-clamp: ${n};
-webkit-box-orient: vertical;
${maxHeight ? ` max-height: ${maxHeight}px` : ''};`;
		}
	}
}

export const styleHelper = new StyleHelper();
