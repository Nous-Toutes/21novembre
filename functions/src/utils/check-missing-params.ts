
const checkMissingParameters = (element_to_check: string[], data: any) => {
	const errors: string[] = [];

	for (const element of element_to_check) {
		if ((!data?.[element] || data?.[element] === '') && element !== 'optin') {
			errors.push(element);
		}
	}

	return errors;
};

export default checkMissingParameters;

