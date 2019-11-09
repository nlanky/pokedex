import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const NumberDisplay = (props) => {
	const {
		number,
		name,
	} = props;

	const numberString = `#${number} ${name}`;

	return (
		<div className="number-display-wrapper">
			<div className="number-display">
				{numberString}
			</div>
		</div>
	);
};

NumberDisplay.propTypes = {
	number: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
};

export default NumberDisplay;
