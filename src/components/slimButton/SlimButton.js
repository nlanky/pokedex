import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const SlimButton = (props) => {
	const {
		colour,
		noMargin,
	} = props;

	return (
		<div
			className="slim-button"
			style={{
				backgroundColor: colour,
				marginRight: noMargin ? 0 : 15,
			}}
		/>
	);
};

SlimButton.propTypes = {
	colour: PropTypes.string,
	noMargin: PropTypes.bool,
};

SlimButton.defaultProps = {
	colour: '#2A2B26',
	noMargin: false,
};

export default SlimButton;
