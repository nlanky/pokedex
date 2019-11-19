import React from 'react';

import axios from 'axios';
import {Wave} from 'better-react-spinkit';
import {FaChevronLeft, FaChevronRight, FaChevronUp, FaChevronDown} from 'react-icons/fa';

import {
	generatePokemonTypeEffectiveness,
	selectSecondaryDisplayFlavourText,
	selectAbilityFlavourText,
} from '../../utils/common';

import '../../styles/app.scss';

import MicLight from '../micLight';
import Sprite from '../sprite';
import NumberDisplay from '../numberDisplay';
import TypeDisplay from '../typeDisplay';
import SecondaryDisplay from '../secondaryDisplay';
import DirectionalPad from '../directionalPad';
import IndicatorLight from '../indicatorLight';
import GridButton from '../gridButton';
import ConfirmButton from '../confirmButton';
import SlimButton from '../slimButton';
import Vent from '../vent';
import SpriteButton from '../spriteButton';
import PowerButton from '../powerButton';

// Useful object to ensure order of sprites is correct
const spriteRefObj = {
	0: 'front_default',
	1: 'back_default',
	2: 'front_shiny',
	3: 'back_shiny',
};

// Set this to last Pokemon in API index available
const maxPokedexNumber = 807;

export default class Pokedex extends React.Component {
	state = {
		pokemonApiUrl: 'https://pokeapi.co/api/v2/pokemon/',
		cryUrl: '',
		pokedexNumber: 1,
		baseData: [],
		speciesData: [],
		typeData: [],
		encounterData: [],
		abilityData: [],
		evolutionData: [],
		statisticsData: [],
		dataReady: false,
		activeSprite: 0,
		language: 'en',
		activeSecondaryDisplay: 'flavourText',
		cache: {},
	};

	componentDidMount() {
		this.getData();
	}

	async getData(id) {
		const {
			pokemonApiUrl,
			pokedexNumber,
			cache,
		} = this.state;

		let baseData = [];
		let speciesData = [];
		let typeData = [];
		let encounterData = [];
		let abilityData = [];
		let evolutionData = [];
		let statisticsData = [];
		const pokedexNumberToGet = id ? id : pokedexNumber;

		// Use cache if available
		if (cache[pokedexNumberToGet]) {
			const cacheEntry = cache[pokedexNumberToGet];
			baseData = cacheEntry.baseData;
			speciesData = cacheEntry.speciesData;
			typeData = cacheEntry.typeData;
			encounterData = cacheEntry.encounterData;
			abilityData = cacheEntry.abilityData;
			evolutionData = cacheEntry.evolutionData;
			statisticsData = cacheEntry.statisticsData;
		} else {
			// First, get the base Pokemon data
			const baseDataResponse = await axios.get(pokemonApiUrl + pokedexNumberToGet);
			baseData = baseDataResponse.data;

			// Use base data to make requests to other API endpoints
			const baseDataPromises = [
				axios.get(baseData.species.url),
				axios.get(baseData.location_area_encounters),
				axios.get(baseData.stats[0].stat.url),
				axios.get(baseData.stats[1].stat.url),
				axios.get(baseData.stats[2].stat.url),
				axios.get(baseData.stats[3].stat.url),
				axios.get(baseData.stats[4].stat.url),
				axios.get(baseData.stats[5].stat.url),
			];

			// Pokemon may have 1 or 2 types
			const typeArr = baseData.types.sort((a, b) => {return a.slot - b.slot});
			baseDataPromises.push(axios.get(typeArr[0].type.url));
			if (typeArr[1])
				baseDataPromises.push(axios.get(typeArr[1].type.url));

			// Pokemon may have up to 3 abilities
			const abilityArr = baseData.abilities.sort((a, b) => {return a.slot - b.slot});
			baseDataPromises.push(axios.get(abilityArr[0].ability.url));
			if (abilityArr[1]) {
				baseDataPromises.push(axios.get(abilityArr[1].ability.url));
				if (abilityArr[2])
					baseDataPromises.push(axios.get(abilityArr[2].ability.url));
			}

			// Can make these requests synchronously, only relying on base data
			await Promise.all(baseDataPromises).then((res) => {
				speciesData = res[0].data;
				encounterData = res[1].data;
				statisticsData.push(res[2].data, res[3].data, res[4].data, res[5].data, res[6].data, res[7].data);
				typeData.push(res[8].data);				
				
				const noOfTypes = typeArr.length;
				const noOfAbilities = abilityArr.length;
				if (noOfTypes === 1) {
					switch (noOfAbilities) {
						case 1:
							abilityData.push(res[9].data);
							break;
						case 2:
							abilityData.push(res[9].data);
							abilityData.push(res[10].data);
							break;
						case 3:
							abilityData.push(res[9].data);
							abilityData.push(res[10].data);
							abilityData.push(res[11].data);
							break;
						default:
							break;
					}
				} else {
					typeData.push(res[9].data);
					switch (noOfAbilities) {
						case 1:
							abilityData.push(res[10].data);
							break;
						case 2:
							abilityData.push(res[10].data);
							abilityData.push(res[11].data);
							break;
						case 3:
							abilityData.push(res[10].data);
							abilityData.push(res[11].data);
							abilityData.push(res[12].data);
							break;
						default:
							break;
					}
				}

				// Add hidden property to ability data
				abilityData.forEach(function(ability, index) {
					this[index].hidden = abilityArr[index].is_hidden;
				}, abilityData);

				// Sort statistics by game index
				statisticsData.sort((a, b) => {
					if (a.game_index > b.game_index) return 1;
					if (a.game_index < b.game_index) return -1;
					return 0;
				});

				cache[pokedexNumberToGet] = {
					baseData,
					speciesData,
					typeData,
					encounterData,
					abilityData,
					statisticsData,
				}
			});

			// After we have species data, we can get evolution line data
			const evolutionDataResponse = await axios.get(speciesData.evolution_chain.url);
			evolutionData = evolutionDataResponse.data;
			cache[pokedexNumberToGet].evolutionData = evolutionData;
		}

		this.setState({
			baseData,
			speciesData,
			typeData,
			encounterData,
			abilityData,
			evolutionData,
			statisticsData,
			activeSprite: 0, // Always reset back to default image
			dataReady: true, // Remove loading spinner
		});
	}

	// Click handlers
	onNextPokemonClick = () => {
		const {
			pokedexNumber,
		} = this.state;

		const nextPokedexNumber = pokedexNumber + 1;
		if (nextPokedexNumber > maxPokedexNumber) return;

		this.setState({
			dataReady: false, // Add loading spinner
			pokedexNumber: nextPokedexNumber, // Update Pokedex number in state
			activeSecondaryDisplay: 'flavourText',
		});

		this.getData(nextPokedexNumber);
	}

	onPrevPokemonClick = () => {
		const {
			pokedexNumber,
		} = this.state;

		const prevPokedexNumber = pokedexNumber - 1;
		if (prevPokedexNumber < 1) return;

		this.setState({
			dataReady: false, // Add loading spinner
			pokedexNumber: prevPokedexNumber, // Update Pokedex number in state
			activeSecondaryDisplay: 'flavourText',
		})

		this.getData(prevPokedexNumber);
	}

	onNextSpriteClick = () => {
		const {
			activeSprite,
		} = this.state;

		const nextSpriteNumber = activeSprite + 1;
		if (nextSpriteNumber > 3) return;

		this.setState({
			activeSprite: nextSpriteNumber,
		});
	}

	onPrevSpriteClick = () => {
		const {
			activeSprite,
		} = this.state;

		const prevSpriteNumber = activeSprite - 1;
		if (prevSpriteNumber < 0) return;

		this.setState({
			activeSprite: prevSpriteNumber,
		});
	}

	onGridButtonClick = (screen) => {
		if (!screen) return;

		this.setState({
			activeSecondaryDisplay: screen,
		});
	}

	onConfirmButtonClick = () => {
		const randomNumber = Math.floor(Math.random() * (maxPokedexNumber - 1) + 1);
		this.setState({
			pokedexNumber: randomNumber,
			dataReady: false,
			activeSecondaryDisplay: 'flavourText',
		})

		this.getData(randomNumber);
	}

	scrollUp = () => {
		const secondaryDisplay = document.getElementById('secondary_display');
		if (!secondaryDisplay) return;
		secondaryDisplay.scrollTop -= 20;
	}

	scrollDown = () => {
		const secondaryDisplay = document.getElementById('secondary_display');
		if (!secondaryDisplay) return;
		secondaryDisplay.scrollTop += 20;
	}

	render() {
		const {
			pokedexNumber,
			baseData,
			speciesData,
			typeData,
			encounterData,
			abilityData,
			evolutionData,
			statisticsData,
			dataReady,
			activeSprite,
			language,
			activeSecondaryDisplay,
		} = this.state;

		if (!dataReady) return <Wave />;

		// Name
		const pokemonName = speciesData.names.filter(name => name.language.name === language)[0].name;

		// Types
		const typeOne = typeData[0].name;
		const typeTwoExists = typeof typeData[1] === 'object';
		const typeTwo = typeTwoExists ? typeData[1].name : null;

		// Abilities
		let abilities = [];
		for (let i = 0; i < abilityData.length; i++) {
			const ability = abilityData[i];
			abilities.push({
				name: ability.names.filter(name => name.language.name === language)[0].name,
				flavourText: selectAbilityFlavourText(ability.flavor_text_entries, language),
				hidden: ability.hidden,
			});
		}

		// Type effectiveness
		const typeEffectivenessObj = generatePokemonTypeEffectiveness(typeData[0].damage_relations, typeTwoExists ? typeData[1].damage_relations : false, abilities);

		// Sprites
		const spriteObj = baseData.sprites;

		// Flavour text (description)
		const flavourText = selectSecondaryDisplayFlavourText(speciesData.flavor_text_entries, language);

		// Sprite display
		const displayLeftNumber = pokedexNumber - 1;
		const displayRightNumber = pokedexNumber + 1;
		const displayLeftCycle = displayLeftNumber !== 0;
		const displayRightCycle = displayRightNumber !== maxPokedexNumber;
		const displayTopCycle = (activeSprite - 1) >= 0;
		const displayBottomCycle = (activeSprite + 1) <= 3;

		// Statistics
		const statsArr = baseData.stats;

		// Sort statistics array to easily add name in correct language from statisticsData
		// statRefArr is ordered by game index
		const statRefArr = [
			'hp',
			'attack',
			'defense',
			'speed',
			'special-attack',
			'special-defense',
		];
		const processedStatsArr = [];
		statRefArr.forEach((statName) => {
			let found = false;
			statsArr.filter((stat) => {
				if (!found && stat.stat.name === statName) {
					processedStatsArr.push(stat);
					found = true;
					return false;
				}

				return true;
			});
		});

		statisticsData.forEach(function(value, index) {
			this[index].name = value.names.filter(item => item.language.name === language)[0].name;
		}, processedStatsArr);

		// Height & Weight
		const heightWeightObj = {
			height: baseData.height,
			weight: baseData.weight,
		};

		return(
			<div className="container">
				<div className="left-screen">
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
					<div className="left-screen-content">
						<div className="main-display-wrapper">
							<div className="main-display-cut" />
							<div className="sprite-container">
								<div className="sprite-top">
									<div className="sprite-cycle top" onClick={this.onPrevSpriteClick}>
										{displayTopCycle && 
											<FaChevronUp color="#fff" />
										}
									</div>
								</div>
								<div className="sprite-middle">
									<div className="sprite-cycle left" onClick={this.onPrevPokemonClick}>
										{displayLeftCycle &&
											<>
												<FaChevronLeft color="#fff" />
												<span className="nav-number-text">#{displayLeftNumber}</span>
											</>
										}										
									</div>
									<div className="sprite-wrapper">
										{Object.keys(spriteObj).map(function(spriteKey) {
											const spriteUrl = spriteObj[spriteKey];
											if (!spriteUrl) return;

											return <Sprite spriteUrl={spriteUrl} spriteKey={spriteKey} activeSprite={spriteKey === spriteRefObj[activeSprite]} key={spriteKey} />;
										})}
									</div>
									<div className="sprite-cycle right" onClick={this.onNextPokemonClick}>
										{displayRightCycle &&
											<FaChevronRight color="#fff" />
										}
										<span className="nav-number-text">#{displayRightNumber}</span>
									</div>
								</div>
								<div className="sprite-bottom">
									<div className="sprite-cycle bottom" onClick={this.onNextSpriteClick}>
										{displayBottomCycle && 
												<FaChevronDown color="#fff" />
										}
									</div>
								</div>
							</div>
							<div className="main-display-footer">
								<SpriteButton />
								<div className="vent-container">
									<Vent />
									<Vent />
									<Vent />
									<Vent />
								</div>
							</div>
						</div>
						<div className="left-screen-footer">
							<div className="left-screen-footer-left-col">
								<PowerButton />
							</div>
							<div className="left-screen-footer-middle-col">
								<div className="left-screen-footer-row">
									<SlimButton colour="#D72113" />
									<SlimButton colour="#fff" noMargin />
								</div>
								<div className="left-screen-footer-row">
									<NumberDisplay number={pokedexNumber} name={pokemonName} />
								</div>
							</div>
							<div className="left-screen-footer-right-col">
								<DirectionalPad
									upAction={this.onPrevSpriteClick}
									rightAction={this.onNextPokemonClick}
									downAction={this.onNextSpriteClick}
									leftAction={this.onPrevPokemonClick}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="hinge-container">
					<div className="hinge-top" />
					<div className="hinge-middle" />
					<div className="hinge-bottom" />
					<div className="hinge-bottom-lid" />
				</div>
				<div className="right-screen">
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
						<div className="right-lid-bottom-left-col" />
						<div className="right-lid-bottom-right-col" />						
					</div>
					<div className="right-screen-content">
						<div className="secondary-display-wrapper" id="secondary_display">
							<SecondaryDisplay
								activeDisplay={activeSecondaryDisplay}
								flavourText={flavourText}
								statistics={processedStatsArr}
								heightWeight={heightWeightObj}
								typeEffectiveness={typeEffectivenessObj}
								abilities={abilities}
							/>
						</div>
						<div className="grid-button-container">
							<GridButton clickHandler={this.onGridButtonClick} screen="flavourText" />
							<GridButton clickHandler={this.onGridButtonClick} screen="statistics" />
							<GridButton clickHandler={this.onGridButtonClick} screen="heightWeight" />
							<GridButton clickHandler={this.onGridButtonClick} screen="typeEffectiveness" />
							<GridButton clickHandler={this.onGridButtonClick} screen="abilities" />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
						</div>
						<div className="misc-button-container">
							<div className="misc-button-left-col">
								<div className="white-grid-button" onClick={this.scrollUp} />
								<div className="white-grid-button" onClick={this.scrollDown} />
							</div>
							<div className="misc-button-right-col">
								<div className="misc-button-row">
									<SlimButton />
									<SlimButton noMargin />
								</div>
								<div className="misc-button-row">
									<ConfirmButton clickHandler={this.onConfirmButtonClick} />
								</div>
							</div>
						</div>
						<div className="type-display-container">
							<div className="type-display-wrapper">
								<TypeDisplay type={typeOne} />
							</div>
							<div className="type-display-wrapper">
								{typeTwo &&
									<TypeDisplay type={typeTwo} />
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
