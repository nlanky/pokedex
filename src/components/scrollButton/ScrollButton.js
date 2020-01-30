import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const ScrollButton = (props) => {
	const {
		directionUp,
		clickHandler,
	} = props;

	const onClick = () => {
		clickHandler();
	};

	const onKeyDown = () => {};

	return (
		<div
			className={`white-grid-button ${directionUp ? 'up' : 'down'}`}
			onClick={onClick}
			role="button"
			tabIndex={0}
			aria-label={`Scroll secondary display ${directionUp ? 'up' : 'down'}`}
			onKeyDown={onKeyDown}
		/>
	);
};

ScrollButton.propTypes = {
	directionUp: PropTypes.bool,
	clickHandler: PropTypes.func.isRequired,
};

ScrollButton.defaultProps = {
	directionUp: false,
};

export default ScrollButton;
