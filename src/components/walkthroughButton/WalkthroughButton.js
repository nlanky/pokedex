import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const WalkthroughButton = (props) => {
	const {
		clickHandler,
	} = props;

	const onClick = () => {
		clickHandler();
	};

	const onKeyDown = () => {};

	return (
		<div
			className="walkthrough-button"
			onClick={onClick}
			role="button"
			tabIndex={0}
			aria-label="Toggle walkthrough"
			onKeyDown={onKeyDown}
		/>
	);
};

WalkthroughButton.propTypes = {
	clickHandler: PropTypes.func.isRequired,
};

export default WalkthroughButton;
