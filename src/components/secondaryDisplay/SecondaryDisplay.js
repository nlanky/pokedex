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
		noWildEncounters,
	} = props;

	if (noWildEncounters) {
		return (
			<div className="encounter-container">
				<div className="no-wild-encounters">
					No wild encounters
				</div>
			</div>
		);
	}

	return encounters.map((generation) => {
		if (generation.data.length === 0) return null;

		return (
			<div className="encounter-container" key={generation.generation}>
				<div className="encounter-generation">
					<div className="encounter-header">
						{`Generation ${generation.generation}`}
					</div>
					{generation.data.map((version, index) => (
						<div className="encounter-version" key={index}>
							<div className="encounter-version-name">
								{version.version}
							</div>
							<div className="encounter-locations">
								{version.locations.join(', ')}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	});
};

const EvolutionChainComponent = (props) => {
	const {
		evolutionChain,
	} = props;

	const Evolution = (evoProps) => {
		const {
			evolution,
		} = evoProps;

		const evolutionStage = evolution.stage;
		let evolutionStageText = 'Unevolved';
		if (evolutionStage === 1) evolutionStageText = 'First Evolution';
		if (evolutionStage === 2) evolutionStageText = 'Second Evolution';

		return (
			<div className="evolution-wrapper" key={evolution.name}>
				<div className="evolution-sprite-wrapper">
					<img
						alt={`${evolution.name} sprite`}
						src={evolution.sprite}
					/>
				</div>
				<div>{evolution.name}</div>
				<div>{evolutionStageText}</div>
				{evolution.evolutionDetails.map((details, index) => <EvolutionDetails details={details} key={index} />)}
			</div>
		);
	};

	const EvolutionDetails = (detailProps) => {
		const {
			details,
		} = detailProps;

		const {
			trigger,
			min_level,
			item,
			held_item,
			min_happiness,
			min_affection,
			min_beauty,
			known_move,
			known_move_type,
			location,
			time_of_day,
			gender,
			party_species,
			party_type,
			turn_upside_down,
			needs_overworld_rain,
			relative_physical_stats,
		} = details;

		// Determine gender name for display
		let genderName = 'Female';
		if (gender === 2) genderName = 'Male';

		// Determine physical stats for display
		let physicalStatDisplay = 'Attack = Defense';
		if (relative_physical_stats === -1) physicalStatDisplay = 'Attack < Defense';
		if (relative_physical_stats === 1) physicalStatDisplay = 'Attack > Defense';

		const showLevel = trigger === 'Level up' && min_level;

		// TODO: Make language dependent
		// TODO: Add game when API data becomes available e.g. Cosmoem
		return (
			<div className="evolution-details-wrapper">
				{trigger && <div>{trigger === 'Shed' ? 'Slot in party and Pokeball' : trigger}</div>}
				{showLevel && <div>{min_level}</div>}
				{item && <div>{item}</div>}
				{held_item && <div>{held_item}</div>}
				{min_happiness && (
					<div>
						Happiness:
						{` ${min_happiness}`}
					</div>
				)}
				{min_affection && (
					<div>
						Affection:
						{` ${min_affection}`}
					</div>
				)}
				{min_beauty && (
					<div>
						Beauty:
						{` ${min_beauty}`}
					</div>
				)}
				{known_move && <div>{known_move}</div>}
				{known_move_type && <div>Knows {known_move_type} move</div>}
				{location && <div>{location}</div>}
				{time_of_day && <div>{time_of_day === 'day' ? 'Day' : 'Night'}</div>}
				{gender && <div>{genderName}</div>}
				{party_species && <div>In party: {party_species}</div>}
				{party_type && <div>Type in party: {party_type}</div>}
				{turn_upside_down && <div>Device upside down</div>}
				{needs_overworld_rain && <div>Overworld rain/fog</div>}
				{relative_physical_stats !== null && <div>{physicalStatDisplay}</div>}
			</div>
		);
	};

	return (
		<div className="evolution-chain-container">
			{evolutionChain.map((evolution, index) => <Evolution evolution={evolution} key={index} noOfEvolution={index} />)}
		</div>
	);
};

const MovesComponent = (props) => {
	const {
		moves,
	} = props;

	const methodDisplayOrder = [
		'level-up',
		'machine',
		'egg',
		'tutor',
		'stadium-surfing-pikachu',
	];

	const sortMethods = (a, b) => methodDisplayOrder.indexOf(a.name) - methodDisplayOrder.indexOf(b.name);

	const sortMovesByLevel = (a, b) => {
		if (a.levelLearnedAt === b.levelLearnedAt) {
			return a.name.localeCompare(b.name);
		}

		return a.levelLearnedAt - b.levelLearnedAt;
	};

	const sortMovesByName = (a, b) => a.name.localeCompare(b.name);

	// TODO: Allow for different languages?
	const getMoveMethodHeader = (method) => {
		let header = '';
		switch (method) {
			case 'machine':
				header = 'By TM/HM/TR';
				break;
			case 'level-up':
				header = 'By leveling up';
				break;
			case 'egg':
				header = 'By breeding';
				break;
			case 'tutor':
				header = 'By tutoring';
				break;
			case 'stadium-surfing-pikachu':
				header = 'Stadium Surfing Pikachu';
				break;
			default:
				break;
		}

		return header;
	};

	return moves.map((generation) => {
		if (generation.methods.length === 0) return null;

		return (
			<div className="moves-container" key={generation.generation}>
				<div className="moves-generation">
					<div className="moves-header">
						{`Generation ${generation.generation}`}
					</div>
					{generation.methods.sort(sortMethods).map((method, methodIndex) => {
						const methodName = method.name;
						const isLevelUp = methodName === 'level-up';

						if (isLevelUp) method.moves.sort(sortMovesByLevel);
						else method.moves.sort(sortMovesByName);

						return (
							<div className="moves-method-container" key={methodIndex}>
								<div className="moves-method-header">{getMoveMethodHeader(methodName)}</div>
								{method.moves.map((move, moveIndex) => (
									<div className="moves-row" key={moveIndex}>
										<div className={isLevelUp ? 'moves-name-level' : 'moves-name'}>{move.name}</div>
										{isLevelUp && (
											<div className="moves-level">
												Level
												{` ${move.levelLearnedAt}`}
											</div>
										)}
									</div>
								))}
							</div>
						);
					})}
				</div>
			</div>
		);
	});
};

const VarietiesComponent = (props) => {
	const {
		varieties,
	} = props;

	return (
		<div className="varieties-container">
			{varieties.map((variety) => {
				const {
					name,
				} = variety;

				return (
					<div className="variety-wrapper" key={name}>
						<div className="variety-sprite-wrapper">
							<img
								alt={`${name} sprite`}
								src={variety.sprite}
							/>
						</div>
						<div>{name}</div>
					</div>
				);
			})}
		</div>
	);

};

const EggGroupsComponent = (props) => {
	const {
		eggGroups,
	} = props;

	return (
		<div className="egg-group-container">
			{eggGroups.map((eggGroup) => {
				const {
					name,
				} = eggGroup;

				return (
					<div className="egg-group-wrapper" key={name}>
						<div className="egg-group-name">{name}</div>
						<div className="egg-group-species">
							Pok&eacute;mon in group:
							{` ${eggGroup.numberSpecies}`}
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
		encounters,
		noWildEncounters,
		evolutionChain,
		activeDisplay,
		moves,
		varieties,
		eggGroups,
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
			return <EncountersComponent encounters={encounters} noWildEncounters={noWildEncounters} />;
		case 'evolutionChain':
			return <EvolutionChainComponent evolutionChain={evolutionChain} />;
		case 'moves':
			return <MovesComponent moves={moves} />;
		case 'varieties':
			return <VarietiesComponent varieties={varieties} />;
		case 'eggGroups':
			return <EggGroupsComponent eggGroups={eggGroups} />;
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
	noWildEncounters: PropTypes.bool.isRequired,
	evolutionChain: PropTypes.array.isRequired,
	moves: PropTypes.array.isRequired,
	varieties: PropTypes.array.isRequired,
	eggGroups: PropTypes.array.isRequired,
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

EvolutionChainComponent.propTypes = {
	evolutionChain: PropTypes.array.isRequired,
};

MovesComponent.propTypes = {
	moves: PropTypes.array.isRequired,
};

VarietiesComponent.propTypes = {
	varieties: PropTypes.array.isRequired,
};

EggGroupsComponent.propTypes = {
	eggGroups: PropTypes.array.isRequired,
};

export default SecondaryDisplay;
