import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const GridButton = (props) => {
	const {
		screen,
		clickHandler,
	} = props;

	const onClick = () => {
		clickHandler(screen);
	};

	const onKeyDown = () => {};

	return (
		<div
			className={`grid-button ${screen}`}
			onClick={onClick}
			role="button"
			tabIndex={0}
			aria-label="Grid button"
			onKeyDown={onKeyDown}
		/>
	);
};

GridButton.propTypes = {
	screen: PropTypes.string.isRequired,
	clickHandler: PropTypes.func.isRequired,
};

export default GridButton;
