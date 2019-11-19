import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

import typeColourObj from '../../utils/typeColours';

const TypeDisplay = (props) => {
	const {
		type,
	} = props;

	// Use the reference object to get the correct type background
	const background = typeColourObj[type];

	return (
		<div className="type-display" style={{ backgroundColor: background }}>
			{type[0].toUpperCase() + type.slice(1)}
		</div>
	);
};

TypeDisplay.propTypes = {
	type: PropTypes.string.isRequired,
};

export default TypeDisplay;
