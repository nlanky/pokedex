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
				const {
					name,
					base_stat,
				} = stat;

				return (
					<div className="statistic-wrapper" key={stat.name}>
						<div>{name}</div>
						<div>{base_stat}</div>
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
			{heightWeight.map((item) => {
				const {
					name,
					value,
				} = item;

				return (
					<div className="height-weight-wrapper" key={name}>
						<div>{name}</div>
						<div>
							{value / 10}
							{name === 'Height' ? 'm' : 'kg'}
						</div>
					</div>
				);
			})}
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
	const abilityText = [];
	typeEffectiveness.forEach((item) => {
		if (item.type === 'ability') abilityText.push(item);
		else {
			const {
				multiplier,
			} = item;

			if (multiplier > 1) weakTo.push(item);
			else if (multiplier === 1) damagedNormallyBy.push(item);
			else if (multiplier > 0) resistantTo.push(item);
			else immuneTo.push(item);
		}
	});

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
									name,
									multiplier,
								} = typeEffect;

								return (
									<div className="type-effect" style={{ backgroundColor: typeColourObj[name] }} key={name}>
										<div className="type-name">
											{name}
										</div>
										<div className="type-effectiveness">
											{`${multiplier}x`}
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
									name,
									multiplier,
								} = typeEffect;

								return (
									<div
										key={name}
										className="type-effect"
										style={{ backgroundColor: typeColourObj[name] }}
									>
										<div className="type-name">
											{name}
										</div>
										<div className="type-effectiveness">
											{`${multiplier}x`}
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
									name,
									multiplier,
								} = typeEffect;

								return (
									<div
										key={name}
										className="type-effect"
										style={{ backgroundColor: typeColourObj[name] }}
									>
										<div className="type-name">
											{name}
										</div>
										<div className="type-effectiveness">
											{`${multiplier}x`}
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
									name,
									multiplier,
								} = typeEffect;

								return (
									<div
										key={name}
										className="type-effect"
										style={{ backgroundColor: typeColourObj[name] }}
									>
										<div className="type-name">
											{name}
										</div>
										<div className="type-effectiveness">
											{`${multiplier}x`}
										</div>
									</div>
								);
							})}
						</>
					)}
				</div>
			</div>
			{abilityText.length > 0 && (
				<div className="type-effect-ability-container">
					{abilityText.map((ability) => {
						const {
							name,
							description,
						} = ability;

						return (
							<div className="type-effect-ability-wrapper" key={name}>
								{description}
							</div>
						);
					})}
				</div>
			)}
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

const EncountersComponent = (props) => {
	const {
		encounters,
	} = props;

	return encounters.map((generation) => {
		if (generation.data.length === 0) return null;

		return (
			<div className="encounter-container" key={generation.generation}>
				<div>
					{`Generation ${generation.generation}`}
				</div>
				<div className="encounter-header">
					<div>Location</div>
					<div>Game</div>
					<div>Method</div>
					<div>Levels</div>
					<div>Chance</div>
					<div>Conditions</div>
				</div>
				{generation.data.map((item) => {
					return (
						<div className="encounter-wrapper" key={item.key}>
							<div>{item.location}</div>
							<div>{item.game}</div>
							<div>{item.method}</div>
							<div>{item.level}</div>
							<div>{item.chance}</div>
							<div>
								{item.conditions.map((condition) => {
									return (
										<div key={condition.key}>
											{condition}
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		);
	});
};

const SecondaryDisplay = (props) => {
	const {
		flavourText,
		statistics,
		heightWeight,
		typeEffectiveness,
		abilities,
		encounters,
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
		case 'encounters':
			return <EncountersComponent encounters={encounters} />;
		default:
			return null;
	}
};

SecondaryDisplay.propTypes = {
	flavourText: PropTypes.string.isRequired,
	statistics: PropTypes.array.isRequired,
	activeDisplay: PropTypes.string.isRequired,
	heightWeight: PropTypes.array.isRequired,
	typeEffectiveness: PropTypes.array.isRequired,
	abilities: PropTypes.array.isRequired,
	encounters: PropTypes.array.isRequired,
};

FlavourTextComponent.propTypes = {
	flavourText: PropTypes.string.isRequired,
};

StatisticsComponent.propTypes = {
	statistics: PropTypes.array.isRequired,
};

HeightWeightComponent.propTypes = {
	heightWeight: PropTypes.array.isRequired,
};

TypeEffectivenessComponent.propTypes = {
	typeEffectiveness: PropTypes.array.isRequired,
};

AbilitiesComponent.propTypes = {
	abilities: PropTypes.array.isRequired,
};

EncountersComponent.propTypes = {
	encounters: PropTypes.array.isRequired,
};

export default SecondaryDisplay;
