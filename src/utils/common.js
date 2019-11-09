const convertStringToSentenceCase = (str) => {
	const strArr = str.split(/[ -]+/);
	var returnStr = '';
	for (let i = 0; i < strArr.length; i++) {
		var strIteration = strArr[i];
		if (strIteration === 'hp') return 'HP';

		returnStr += `${strIteration.charAt(0).toUpperCase()}${strIteration.slice(1)} `;
	}

	return returnStr.slice(0, -1);
};

export default convertStringToSentenceCase;
