import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const ConfirmButton = (props) => {
	const {
		clickHandler,
	} = props;

	const onClick = () => {
		clickHandler();
	};

	const onKeyDown = () => {};

	return (
		<div
			className="confirm-button"
			onClick={onClick}
			role="button"
			tabIndex={0}
			aria-label="Random Pokemon button"
			onKeyDown={onKeyDown}
		/>
	);
};

ConfirmButton.propTypes = {
	clickHandler: PropTypes.func.isRequired,
};

export default ConfirmButton;
