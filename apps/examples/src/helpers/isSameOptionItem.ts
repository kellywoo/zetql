export const isSameOptionItem = (op1: Set<string>, op2: Set<string>) => {
	if (op1.size !== op2.size) {
		return false;
	}
	for (const key of op1.keys()) {
		if (!op2.has(key)) {
			return false;
		}
	}
	return true;
};
