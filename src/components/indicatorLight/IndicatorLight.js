import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const IndicatorLight = (props) => {
	const {
		colour,
	} = props;

	return (
		<div className={`indicator-light ${colour}`} />
	);
};

IndicatorLight.propTypes = {
	colour: PropTypes.string.isRequired,
};

export default IndicatorLight;
