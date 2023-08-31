export const fetchClient = (...args: Parameters<typeof fetch>) => {
	return fetch(...args).then((res) => {
		return res
			.json()
			.then((json) => {
				if (!res.ok) {
					throw json;
				}
				return json;
			})
			.catch((err) => {
				if (res.ok) {
					return {};
				} else {
					throw err;
				}
			});
	});
};
