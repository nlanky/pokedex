import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const SecondaryDisplay = (props) => {
	const {
		flavourText,
		statistics,
		heightWeight,
		activeDisplay,
	} = props;

	switch (activeDisplay) {
		case 'flavourText':
			return (
				<div className="secondary-display-wrapper">
					{flavourText}
				</div>
			);
		case 'statistics':
			return (
				<div className="secondary-display-wrapper">
					{statistics.map((val) => {
						return (
							<div className="statistic-wrapper" key={val.name}>
								<div>{val.name}</div>
								<div>{val.value}</div>
							</div>
						);
					})}
				</div>
			);
		case 'heightWeight':
			return (
				<div className="secondary-display-wrapper">
					<div className="height-weight-wrapper">
						<div>Height</div>
						<div>{`${heightWeight.height / 10}m`}</div>
					</div>
					<div className="height-weight-wrapper">
						<div>Weight</div>
						<div>{`${heightWeight.weight / 10}kg`}</div>
					</div>
				</div>
			);
		default:
			return null;
	}
};

SecondaryDisplay.propTypes = {
	flavourText: PropTypes.string.isRequired,
	statistics: PropTypes.array.isRequired,
	activeDisplay: PropTypes.string.isRequired,
	heightWeight: PropTypes.object.isRequired,
};

export default SecondaryDisplay;
