import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const SlimButton = (props) => {
	const {
		colour,
		noMargin,
		clickHandler,
		label,
	} = props;

	const onClick = () => {
		clickHandler();
	};

	const onKeyDown = () => {};

	return (
		<div
			className={`slim-button ${label}`}
			onClick={onClick}
			role="button"
			tabIndex={0}
			aria-label="Slim button"
			onKeyDown={onKeyDown}
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
	clickHandler: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
};

SlimButton.defaultProps = {
	colour: '#2A2B26',
	noMargin: false,
};

export default SlimButton;
