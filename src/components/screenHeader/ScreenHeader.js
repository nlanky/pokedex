import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

import MicLight from './components/micLight';
import IndicatorLight from './components/indicatorLight';

const ScreenHeader = (props) => {
	const {
		left,
	} = props;

	if (left) {
		return (
			<div className="left-screen-header">
				<div className="lights-container">
					<MicLight />
					<IndicatorLight colour="red" />
					<IndicatorLight colour="yellow" />
					<IndicatorLight colour="green" />
				</div>
				<div className="lid-middle">
					<div className="lid-diagonal" />
				</div>
				<div className="lid-right">
					<div className="lid-right-top" />
					<div className="lid-right-bottom" />
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="right-lid-top" />
			<div className="right-lid-wrapper">
				<div className="right-lid-left">
					<div className="right-lid-left-box" />
				</div>
				<div className="right-lid-middle">
					<div className="right-lid-middle-cut" />
					<div className="right-lid-middle-diagonal" />
				</div>
				<div className="right-lid-right" />
			</div>
			<div className="right-lid-bottom">
				<div className="right-lid-bottom-row">
					<div className="right-lid-bottom-left-col" />
					<div className="right-lid-bottom-right-col" />
				</div>
			</div>
		</>
	);
};

ScreenHeader.propTypes = {
	left: PropTypes.bool,
};

ScreenHeader.defaultProps = {
	left: false,
};

export default ScreenHeader;
