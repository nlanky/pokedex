import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const DirectionalPad = (props) => {
	const {
		upAction,
		rightAction,
		downAction,
		leftAction,
	} = props;

	const handleKeyPress = () => {
	}

	return (
		<div className="dpad-wrapper">
			<div
				role="button"
				className="dpad-btn dpad-up"
				onClick={upAction}
				onKeyDown={handleKeyPress}
				aria-label="Previous sprite"
				tabIndex={0}
			/>
			<div
				role="button"
				className="dpad-btn dpad-right"
				onClick={rightAction}
				onKeyDown={handleKeyPress}
				aria-label="Next Pokemon"
				tabIndex={0}
			/>
			<div
				role="button"
				className="dpad-btn dpad-middle"
				aria-label="No action"
			>
				<div className="dpad-middle-finger" />
			</div>
			<div
				role="button"
				className="dpad-btn dpad-down"
				onClick={downAction}
				onKeyDown={handleKeyPress}
				aria-label="Next sprite"
				tabIndex={0}
			/>
			<div
				role="button"
				className="dpad-btn dpad-left"
				onClick={leftAction}
				onKeyDown={handleKeyPress}
				aria-label="Previous Pokemon"
				tabIndex={0}
			/>
		</div>
	);
};

DirectionalPad.propTypes = {
	upAction: PropTypes.func.isRequired,
	rightAction: PropTypes.func.isRequired,
	downAction: PropTypes.func.isRequired,
	leftAction: PropTypes.func.isRequired,
};


export default DirectionalPad;
