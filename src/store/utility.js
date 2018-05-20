export const updateObjet = (oldObject, updateProperties) => {
	return {
		...oldObject,
		...updateProperties
	};
};