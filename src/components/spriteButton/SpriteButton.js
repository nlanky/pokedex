import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const SpriteButton = (props) => {
	const {
		clickHandler,
	} = props;

	const onKeyDown = () => {};

	return (
		<div
			className="sprite-button"
			onClick={clickHandler}
			role="button"
			tabIndex={0}
			aria-label="Play Pokemon cry"
			onKeyDown={onKeyDown}
		/>
	);
};

SpriteButton.propTypes = {
	clickHandler: PropTypes.func.isRequired,
};

export default SpriteButton;
