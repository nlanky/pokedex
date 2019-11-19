import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

import typeColourObj from '../../utils/typeColours';

const FlavourTextComponent = (props) => {
	const {
		flavourText,
	} = props;

	return (
		<>
			{flavourText}
		</>
	);
};

const StatisticsComponent = (props) => {
	const {
		statistics,
	} = props;

	return (
		<>
			{statistics.map((stat) => {
				return (
					<div className="statistic-wrapper" key={stat.name}>
						<div>{stat.name}</div>
						<div>{stat.base_stat}</div>
					</div>
				);
			})}
		</>
	);
};

const HeightWeightComponent = (props) => {
	const {
		heightWeight,
	} = props;

	return (
		<>
			<div className="height-weight-wrapper">
				<div>Height</div>
				<div>{`${heightWeight.height / 10}m`}</div>
			</div>
			<div className="height-weight-wrapper">
				<div>Weight</div>
				<div>{`${heightWeight.weight / 10}kg`}</div>
			</div>
		</>
	);
};

const TypeEffectivenessComponent = (props) => {
	const {
		typeEffectiveness,
	} = props;

	const weakTo = [];
	const damagedNormallyBy = [];
	const resistantTo = [];
	const immuneTo = [];
	const typeArr = Object.keys(typeEffectiveness);
	for (let i = 0; i < typeArr.length; i++) {
		const type = typeArr[i];
		const effectiveness = typeEffectiveness[type];
		if (effectiveness >= 2) {
			weakTo.push({
				type,
				effectiveness,
			});
		} else if (effectiveness >= 1) {
			damagedNormallyBy.push({
				type,
				effectiveness,
			});
		} else if (effectiveness > 0) {
			resistantTo.push({
				type,
				effectiveness,
			});
		} else {
			immuneTo.push({
				type,
				effectiveness,
			});
		}
	}

	return (
		<div className="type-effect-display">
			<div className="type-effect-container">
				<div className="type-effect-heading">Damaged normally by</div>
				<div className="type-effect-wrapper">
					{damagedNormallyBy.length === 0 ? (
						<div className="type-effect" style={{ backgroundColor: '#2A2B26' }}>
							<div className="type-name">
								None
							</div>
						</div>
					) : (
						<>
							{damagedNormallyBy.map((typeEffect) => {
								const {
									type,
								} = typeEffect;
								return (
									<div className="type-effect" style={{ backgroundColor: typeColourObj[type] }} key={type}>
										<div className="type-name">
											{type}
										</div>
										<div className="type-effectiveness">
											{`${typeEffect.effectiveness}x`}
										</div>
									</div>
								);
							})}
						</>
					)}
				</div>
			</div>
			<div className="type-effect-container">
				<div className="type-effect-heading">Weak to</div>
				<div className="type-effect-wrapper">
					{weakTo.length === 0 ? (
						<div className="type-effect" style={{ backgroundColor: '#2A2B26' }}>
							<div className="type-name">
								None
							</div>
						</div>
					) : (
						<>
							{weakTo.map((typeEffect) => {
								const {
									type,
								} = typeEffect;
								return (
									<div
										key={type}
										className="type-effect"
										style={{ backgroundColor: typeColourObj[type] }}
									>
										<div className="type-name">
											{type}
										</div>
										<div className="type-effectiveness">
											{`${typeEffect.effectiveness}x`}
										</div>
									</div>
								);
							})}
						</>
					)}
				</div>
			</div>
			<div className="type-effect-container">
				<div className="type-effect-heading">Immune to</div>
				<div className="type-effect-wrapper">
					{immuneTo.length === 0 ? (
						<div className="type-effect" style={{ backgroundColor: '#2A2B26' }}>
							<div className="type-name">
								None
							</div>
						</div>
					) : (
						<>
							{immuneTo.map((typeEffect) => {
								const {
									type,
								} = typeEffect;
								return (
									<div
										key={type}
										className="type-effect"
										style={{ backgroundColor: typeColourObj[type] }}
									>
										<div className="type-name">
											{type}
										</div>
										<div className="type-effectiveness">
											{`${typeEffect.effectiveness}x`}
										</div>
									</div>
								);
							})}
						</>
					)}
				</div>
			</div>
			<div className="type-effect-container">
				<div className="type-effect-heading">Resistant to</div>
				<div className="type-effect-wrapper">
					{resistantTo.length === 0 ? (
						<div className="type-effect" style={{ backgroundColor: '#2A2B26' }}>
							<div className="type-name">
								None
							</div>
						</div>
					) : (
						<>
							{resistantTo.map((typeEffect) => {
								const {
									type,
								} = typeEffect;
								return (
									<div
										key={type}
										className="type-effect"
										style={{ backgroundColor: typeColourObj[type] }}
									>
										<div className="type-name">
											{type}
										</div>
										<div className="type-effectiveness">
											{`${typeEffect.effectiveness}x`}
										</div>
									</div>
								);
							})}
						</>
					)}
				</div>
			</div>
			<div className="type-effect-disclaimer">* Abilities may affect type effectiveness.</div>
		</div>
	);
};

const AbilitiesComponent = (props) => {
	const {
		abilities,
	} = props;

	return (
		<div className="ability-container">
			{abilities.map((ability) => {
				const {
					name,
					flavourText,
					hidden,
				} = ability;
				return (
					<div
						key={name}
						className="ability-wrapper"
					>
						<div className="ability-name">
							{name}
							{hidden && ' (Hidden)'}
						</div>
						<div className="ability-description">
							{flavourText}
						</div>
					</div>
				);
			})}
		</div>
	);
};

const SecondaryDisplay = (props) => {
	const {
		flavourText,
		statistics,
		heightWeight,
		typeEffectiveness,
		abilities,
		activeDisplay,
	} = props;

	switch (activeDisplay) {
		case 'flavourText':
			return <FlavourTextComponent flavourText={flavourText} />;
		case 'statistics':
			return <StatisticsComponent statistics={statistics} />;
		case 'heightWeight':
			return <HeightWeightComponent heightWeight={heightWeight} />;
		case 'typeEffectiveness':
			return <TypeEffectivenessComponent typeEffectiveness={typeEffectiveness} />;
		case 'abilities':
			return <AbilitiesComponent abilities={abilities} />;
		default:
			return null;
	}
};

SecondaryDisplay.propTypes = {
	flavourText: PropTypes.string.isRequired,
	statistics: PropTypes.array.isRequired,
	activeDisplay: PropTypes.string.isRequired,
	heightWeight: PropTypes.object.isRequired,
	typeEffectiveness: PropTypes.object.isRequired,
	abilities: PropTypes.array.isRequired,
};

FlavourTextComponent.propTypes = {
	flavourText: PropTypes.string.isRequired,
};

StatisticsComponent.propTypes = {
	statistics: PropTypes.array.isRequired,
};

HeightWeightComponent.propTypes = {
	heightWeight: PropTypes.object.isRequired,
};

TypeEffectivenessComponent.propTypes = {
	typeEffectiveness: PropTypes.object.isRequired,
};

AbilitiesComponent.propTypes = {
	abilities: PropTypes.array.isRequired,
};

export default SecondaryDisplay;
