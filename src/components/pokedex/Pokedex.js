import React from 'react';

import axios from 'axios';
import { Wave } from 'better-react-spinkit';
import {
	FaChevronLeft,
	FaChevronRight,
	FaChevronUp,
	FaChevronDown,
} from 'react-icons/fa';

import {
	maxPokedexNumber,
	generatePokemonTypeEffectiveness,
	selectSecondaryDisplayFlavourText,
	selectAbilityFlavourText,
	importPokemonCry,
	isValidPokedexNumber,
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

export default class Pokedex extends React.Component {
	constructor(props) {
		super(props);
		this.pokemonCry = new Audio();
		this.state = {
			apiUrl: 'https://pokeapi.co/api/v2/',
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
			pokemonCache: {},
			rawDataCache: {},
			pokemonInput: '#1 Bulbasaur',
		};

		// Binding methods
		this.onNextPokemonClick = this.onNextPokemonClick.bind(this);
		this.onPrevPokemonClick = this.onPrevPokemonClick.bind(this);
		this.onNextSpriteClick = this.onNextSpriteClick.bind(this);
		this.onPrevSpriteClick = this.onPrevSpriteClick.bind(this);
		this.onGridButtonClick = this.onGridButtonClick.bind(this);
		this.onConfirmButtonClick = this.onConfirmButtonClick.bind(this);
		this.onSpriteButtonClick = this.onSpriteButtonClick.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onPokemonInput = this.onPokemonInput.bind(this);
		this.onPokemonInputBlur = this.onPokemonInputBlur.bind(this);
		this.onPokemonInputClick = this.onPokemonInputClick.bind(this);
		this.getRawData = this.getRawData.bind(this);
		this.getData = this.getData.bind(this);
		this.processedEncounterData = this.processedEncounterData.bind(this);
		this.searchPokemon = this.searchPokemon.bind(this);
		this.scrollUp = this.scrollUp.bind(this);
		this.scrollDown = this.scrollDown.bind(this);
	}

	componentDidMount() {
		// First load defaults to #1 (Bulbasaur)
		this.getData(false, false);
	}

	// Click handlers
	onNextPokemonClick() {
		const {
			pokedexNumber,
			dataReady,
		} = this.state;

		if (!dataReady) return;

		const nextPokedexNumber = pokedexNumber + 1;
		if (!isValidPokedexNumber(nextPokedexNumber)) return;

		this.setState({
			dataReady: false, // Add loading spinner
			pokedexNumber: nextPokedexNumber, // Update Pokedex number in state
			activeSecondaryDisplay: 'flavourText',
		});

		this.getData(nextPokedexNumber, false);
	}

	onPrevPokemonClick() {
		const {
			pokedexNumber,
			dataReady,
		} = this.state;

		if (!dataReady) return;

		const prevPokedexNumber = pokedexNumber - 1;
		if (!isValidPokedexNumber(prevPokedexNumber)) return;

		this.setState({
			dataReady: false, // Add loading spinner
			pokedexNumber: prevPokedexNumber, // Update Pokedex number in state
			activeSecondaryDisplay: 'flavourText',
		});

		this.getData(prevPokedexNumber, false);
	}

	onNextSpriteClick() {
		const {
			activeSprite,
			dataReady,
		} = this.state;

		if (!dataReady) return;

		const nextSpriteNumber = activeSprite + 1;
		if (nextSpriteNumber > 3) return;

		this.setState({
			activeSprite: nextSpriteNumber,
		});
	}

	onPrevSpriteClick() {
		const {
			activeSprite,
			dataReady,
		} = this.state;

		if (!dataReady) return;

		const prevSpriteNumber = activeSprite - 1;
		if (prevSpriteNumber < 0) return;

		this.setState({
			activeSprite: prevSpriteNumber,
		});
	}

	onGridButtonClick(screen) {
		if (!screen) return;

		const {
			dataReady,
		} = this.state;

		if (!dataReady) return;

		this.setState({
			activeSecondaryDisplay: screen,
		});
	}

	onConfirmButtonClick() {
		const {
			dataReady,
		} = this.state;

		if (!dataReady) return;

		const randomNumber = Math.floor(Math.random() * (maxPokedexNumber - 1) + 1);
		this.setState({
			pokedexNumber: randomNumber,
			dataReady: false,
			activeSecondaryDisplay: 'flavourText',
		});

		this.getData(randomNumber, false);
	}

	onSpriteButtonClick() {
		const {
			dataReady,
		} = this.state;

		if (!dataReady) return;

		this.pokemonCry.play();
	}

	onKeyDown() {};

	onPokemonInput(event) {
		event.preventDefault();
		const {
			value,
		} = event.target;

		if (event.key === 'Enter') {
			const {
				pokedexNumber,
			} = this.state;

			this.setState({
				pokedexNumber,
				dataReady: false,
				activeSecondaryDisplay: 'flavourText',
			});
			this.searchPokemon(value);
			return;
		}

		this.setState({
			pokemonInput: value,
		});
	}

	onPokemonInputBlur(event) {
		event.preventDefault();
		const {
			pokedexNumber,
		} = this.state;

		this.setState({
			pokedexNumber,
			dataReady: false,
			activeSecondaryDisplay: 'flavourText',
		});
		this.searchPokemon(event.target.value);
	}

	onPokemonInputClick(event) {
		event.preventDefault();
		this.setState({
			pokemonInput: '',
		});
	}

	/**
	 * Fetches raw data from cache or API. If fetching from API, saves to cache too.
	 * @param {Number} id - Unique identifier from API
	 * @param {String} type - API endpoint
	 * @param {Boolean} isEncounterData - Adjust for different endpoint format
	 * @returns {Array} Raw data array
	 */
	async getRawData(id, type, isEncounterData) {
		const {
			apiUrl,
			rawDataCache,
		} = this.state;

		// Check if we have the response already cached
		if (rawDataCache[type] && rawDataCache[type][id]) {
			const cachedData = rawDataCache[type][id];

			// Encounter endpoint is in format /pokemon/[id]/encounters
			if (isEncounterData && typeof cachedData.location_area_encounters !== 'string') {
				return cachedData.location_area_encounters;
			}

			if (!isEncounterData) {
				return cachedData;
			}
		}

		// If data not in cache, need to make a request
		if (isEncounterData) {
			return axios.get(`${apiUrl}${type}/${id}/encounters`).then((response) => {
				const responseData = response.data;
				rawDataCache[type][id].location_area_encounters = responseData;
				return responseData;
			});
		}

		return axios.get(`${apiUrl}${type}/${id}`).then((response) => {
			const responseData = response.data;
			if (typeof rawDataCache[type] === 'undefined') rawDataCache[type] = {};
			rawDataCache[type][id] = responseData;
			return responseData;
		});
	}

	/**
	 * Gets data on Pokemon using provided Pokedex number or Pokemon name
	 * Also caches data of Pokemon
	 * @param {Number} id - Pokedex number
	 * @param {String} name - Pokemon name
	 */
	async getData(id, name) {
		const {
			pokedexNumber,
			pokemonCache,
			language,
		} = this.state;

		let baseData = [];
		let speciesData = [];
		let typeData = [];
		let encounterData = [];
		let abilityData = [];
		let evolutionData = [];
		let statisticsData = [];

		let pokemonToGet = pokedexNumber;
		if (id) {
			pokemonToGet = id;
		} else if (name) {
			pokemonToGet = name;
		}

		try {
			// Use cache if available
			if (pokemonCache[pokemonToGet]) {
				const cacheEntry = pokemonCache[pokemonToGet];
				baseData = cacheEntry.baseData;
				speciesData = cacheEntry.speciesData;
				typeData = cacheEntry.typeData;
				encounterData = cacheEntry.encounterData;
				abilityData = cacheEntry.abilityData;
				evolutionData = cacheEntry.evolutionData;
				statisticsData = cacheEntry.statisticsData;
			} else {
				// First, get the base Pokemon data
				baseData = await this.getRawData(pokemonToGet, 'pokemon', false);
				pokemonToGet = baseData.id;

				const speciesUrlArr = baseData.species.url.split('/');

				// Use base data to make requests to other API endpoints
				const baseDataPromises = [
					this.getRawData(speciesUrlArr[speciesUrlArr.length - 2], 'pokemon-species', false),
					this.getRawData(pokemonToGet, 'pokemon', true),
					this.getRawData(1, 'stat', false),
					this.getRawData(2, 'stat', false),
					this.getRawData(3, 'stat', false),
					this.getRawData(4, 'stat', false),
					this.getRawData(5, 'stat', false),
					this.getRawData(6, 'stat', false),
				];

				// Pokemon may have 1 or 2 types
				const typeArr = baseData.types.sort((a, b) => a.slot - b.slot);
				const typeOneUrlArr = typeArr[0].type.url.split('/');
				baseDataPromises.push(this.getRawData(typeOneUrlArr[typeOneUrlArr.length - 2], 'type', false));
				if (typeArr[1]) {
					const typeTwoUrlArr = typeArr[1].type.url.split('/');
					baseDataPromises.push(this.getRawData(typeTwoUrlArr[typeTwoUrlArr.length - 2], 'type', false));
				}

				// Pokemon may have up to 3 abilities
				const abilityArr = baseData.abilities.sort((a, b) => a.slot - b.slot);
				const abilityOneUrlArr = abilityArr[0].ability.url.split('/');
				baseDataPromises.push(this.getRawData(abilityOneUrlArr[abilityOneUrlArr.length - 2], 'ability', false));
				if (abilityArr[1]) {
					const abilityTwoUrlArr = abilityArr[1].ability.url.split('/');
					baseDataPromises.push(this.getRawData(abilityTwoUrlArr[abilityTwoUrlArr.length - 2], 'ability', false));
					if (abilityArr[2]) {
						const abilityThreeUrlArr = abilityArr[2].ability.url.split('/');
						baseDataPromises.push(this.getRawData(abilityThreeUrlArr[abilityThreeUrlArr.length - 2], 'ability', false));
					}
				}

				// Can make these requests synchronously, only relying on base data
				await Promise.all(baseDataPromises).then((res) => {
					speciesData = res[0];
					encounterData = res[1];
					statisticsData.push(
						res[2],
						res[3],
						res[4],
						res[5],
						res[6],
						res[7],
					);
					typeData.push(res[8]);

					const noOfTypes = typeArr.length;
					const noOfAbilities = abilityArr.length;
					if (noOfTypes === 1) {
						switch (noOfAbilities) {
							case 1:
								abilityData.push(res[9]);
								break;
							case 2:
								abilityData.push(res[9]);
								abilityData.push(res[10]);
								break;
							case 3:
								abilityData.push(res[9]);
								abilityData.push(res[10]);
								abilityData.push(res[11]);
								break;
							default:
								break;
						}
					} else {
						typeData.push(res[9]);
						switch (noOfAbilities) {
							case 1:
								abilityData.push(res[10]);
								break;
							case 2:
								abilityData.push(res[10]);
								abilityData.push(res[11]);
								break;
							case 3:
								abilityData.push(res[10]);
								abilityData.push(res[11]);
								abilityData.push(res[12]);
								break;
							default:
								break;
						}
					}

					// Add hidden property to ability data
					abilityData.forEach(function (ability, index) {
						this[index].hidden = abilityArr[index].is_hidden;
					}, abilityData);

					// Sort statistics by game index
					statisticsData.sort((a, b) => {
						if (a.game_index > b.game_index) return 1;
						if (a.game_index < b.game_index) return -1;
						return 0;
					});

					pokemonCache[pokemonToGet] = {
						baseData,
						speciesData,
						typeData,
						encounterData,
						abilityData,
						statisticsData,
					}
				});

				// After we have species data, we can get evolution line data
				const evolutionUrlArr = speciesData.evolution_chain.url.split('/');
				const rawEvolutionData = await this.getRawData(evolutionUrlArr[evolutionUrlArr.length - 2], 'evolution-chain', false);

				// Process evolution data
				const evoChainData = rawEvolutionData.chain;

				// Get name and sprite of evolution from API
				let evoSpeciesUrlArr = evoChainData.species.url.split('/');
				let rawEvoSpeciesData = await this.getRawData(evoSpeciesUrlArr[evoSpeciesUrlArr.length - 2], 'pokemon-species', false);
				let evoBaseUrlArr = rawEvoSpeciesData.varieties[0].pokemon.url.split('/');
				let rawEvoBaseData = await this.getRawData(evoBaseUrlArr[evoBaseUrlArr.length - 2], 'pokemon', false);

				evolutionData.push({
					name: rawEvoSpeciesData.names.filter((name) => name.language.name === language)[0].name,
					sprite: rawEvoBaseData.sprites.front_default,
					stage: 0,
					evolutionDetails: evoChainData.evolution_details,
				});

				const firstStageEvolutions = evoChainData.evolves_to;
				for (let i = 0; i < firstStageEvolutions.length; i += 1) {
					const firstStageEvolution = firstStageEvolutions[i];

					// Get name and sprite of evolution from API
					evoSpeciesUrlArr = firstStageEvolution.species.url.split('/');
					rawEvoSpeciesData = await this.getRawData(evoSpeciesUrlArr[evoSpeciesUrlArr.length - 2], 'pokemon-species', false);
					evoBaseUrlArr = rawEvoSpeciesData.varieties[0].pokemon.url.split('/');
					rawEvoBaseData = await this.getRawData(evoBaseUrlArr[evoBaseUrlArr.length - 2], 'pokemon', false);

					evolutionData.push({
						name: rawEvoSpeciesData.names.filter((name) => name.language.name === language)[0].name,
						sprite: rawEvoBaseData.sprites.front_default,
						stage: 1,
						evolutionDetails: firstStageEvolution.evolution_details,
					});

					const secondStageEvolutions = firstStageEvolution.evolves_to;
					for (let j = 0; j < secondStageEvolutions.length; j += 1) {
						const secondStageEvolution = secondStageEvolutions[j];

						// Get name and sprite of evolution from API
						evoSpeciesUrlArr = secondStageEvolution.species.url.split('/');
						rawEvoSpeciesData = await this.getRawData(evoSpeciesUrlArr[evoSpeciesUrlArr.length - 2], 'pokemon-species', false);
						evoBaseUrlArr = rawEvoSpeciesData.varieties[0].pokemon.url.split('/');
						rawEvoBaseData = await this.getRawData(evoBaseUrlArr[evoBaseUrlArr.length - 2], 'pokemon', false);

						evolutionData.push({
							name: rawEvoSpeciesData.names.filter((name) => name.language.name === language)[0].name,
							sprite: rawEvoBaseData.sprites.front_default,
							stage: 2,
							evolutionDetails: secondStageEvolution.evolution_details,
						});

						const thirdStageEvolutions = secondStageEvolution.evolves_to;
						for (let k = 0; k < thirdStageEvolutions.length; k += 1) {
							const thirdStageEvolution = thirdStageEvolutions[k];

							// Get name and sprite of evolution from API
							evoSpeciesUrlArr = thirdStageEvolution.species.url.split('/');
							rawEvoSpeciesData = await this.getRawData(evoSpeciesUrlArr[evoSpeciesUrlArr.length - 2], 'pokemon-species', false);
							evoBaseUrlArr = rawEvoSpeciesData.varieties[0].pokemon.url.split('/');
							rawEvoBaseData = await this.getRawData(evoBaseUrlArr[evoBaseUrlArr.length - 2], 'pokemon', false);

							evolutionData.push({
								name: rawEvoSpeciesData.names.filter((name) => name.language.name === language)[0].name,
								sprite: rawEvoBaseData.sprites.front_default,
								stage: 2,
								evolutionDetails: thirdStageEvolution.evolution_details,
							});
						}
					}
				}

				evolutionData.babyTriggerItem = rawEvolutionData.baby_trigger_item;
				pokemonCache[pokemonToGet].evolutionData = evolutionData;
			}

			// Set source for Pokemon cry, requires import (importPokemonCry)
			this.pokemonCry.src = await importPokemonCry(pokemonToGet).then((a) => a.default);

			// Process encounter data
			encounterData = await this.processedEncounterData(encounterData);

			// Set Pokemon input value
			const pokemonName = speciesData.names.filter((name) => name.language.name === language)[0].name;
			const pokemonInput = `#${pokemonToGet} ${pokemonName}`;

			this.setState({
				pokedexNumber: pokemonToGet,
				baseData,
				speciesData,
				typeData,
				encounterData,
				abilityData,
				evolutionData,
				statisticsData,
				pokemonInput,
				activeSprite: 0, // Always reset back to default image
				dataReady: true, // Remove loading spinner
			});
		} catch (e) {
			console.log(`getData -> Error: ${JSON.stringify(e)}`);
			alert('Error fetching Pokemon data');

			// If we fail to get data, revert back to current Pokemon
			this.getData(pokedexNumber, false);
		}
	}

	async processedEncounterData(data) {
		const {
			language,
		} = this.state;

		const processedData = [];
		for (let i = 0; i < data.length; i += 1) {
			const rawLocation = data[i];
			const locationAreaUrlArr = rawLocation.location_area.url.split('/');
			const locationArea = await this.getRawData(locationAreaUrlArr[locationAreaUrlArr.length - 2], 'location-area', false);

			// Requires location area response
			const locationUrlArr = locationArea.location.url.split('/');
			const location = await this.getRawData(locationUrlArr[locationUrlArr.length - 2], 'location', false);

			const locationAreaName = locationArea.names.filter((name) => name.language.name === language)[0].name;
			const locationName = location.names.filter((name) => name.language.name === language)[0].name;
			const locationDisplayName = `${locationName}${locationAreaName !== '' ? ` - ${locationAreaName}` : ''}`;

			// Add entry to encounter data for each version and each encounter
			const versionDetails = rawLocation.version_details;
			for (let j = 0; j < versionDetails.length; j += 1) {
				const rawVersion = versionDetails[j];
				const versionUrlArr = rawVersion.version.url.split('/');
				const version = await this.getRawData(versionUrlArr[versionUrlArr.length - 2], 'version', false);
				const versionName = version.names.filter((name) => name.language.name === language)[0].name;

				const encounterDetails = rawVersion.encounter_details;
				for (let k = 0; k < encounterDetails.length; k += 1) {
					const rawEncounter = encounterDetails[k];
					const methodUrlArr = rawEncounter.method.url.split('/');
					const method = await this.getRawData(methodUrlArr[methodUrlArr.length - 2], 'encounter-method', false);
					const methodName = method.names.filter((name) => name.language.name === language)[0].name;
					
					const conditionArr = [];
					const conditionValues = rawEncounter.condition_values;
					for (let l = 0; l < conditionValues.length; l += 1) {
						const rawCondition = conditionValues[l];
						const conditionUrlArr = rawCondition.url.split('/');
						const condition = await this.getRawData(conditionUrlArr[conditionUrlArr.length - 2], 'encounter-condition-value', false);
						conditionArr.push(condition.names.filter((name) => name.language.name === language)[0].name);
					}

					const minLevel = rawEncounter.min_level;
					const maxLevel = rawEncounter.max_level;
					processedData.push({
						location: locationDisplayName,
						version: versionName,
						method: methodName,
						levels: minLevel === maxLevel ? maxLevel : `${minLevel} - ${maxLevel}`,
						chance: rawEncounter.chance,
						conditions: conditionArr,
					});
				}
			}
		}

		return processedData;
	}

	/**
	 * Attempts to get Pokemon data from provided search term
	 * @param {Number|String} searchTerm - Either a Pokedex number or a Pokemon name
	 */
	searchPokemon(searchTerm) {
		const {
			pokedexNumber,
		} = this.state;

		// Search for a Pokedex number
		if (isValidPokedexNumber(searchTerm)) {
			this.getData(searchTerm, false);
			return;
		}

		// Search for a Pokemon name
		if (searchTerm.match(/[A-za-z]+/)) {
			this.getData(false, searchTerm.toLowerCase());
			return;
		}

		this.getData(pokedexNumber, false);
	}

	scrollUp() {
		const {
			dataReady,
		} = this.state;

		if (!dataReady) return;

		const secondaryDisplay = document.getElementById('secondary_display');
		if (!secondaryDisplay) return;
		secondaryDisplay.scrollTop -= 20;
	}

	scrollDown() {
		const {
			dataReady,
		} = this.state;

		if (!dataReady) return;

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
			pokemonInput,
		} = this.state;

		// Declare variables for rendering
		let typeOne = '';
		let typeTwo = '';
		const abilities = [];
		let typeEffectivenessObj = {};
		let spriteObj = {};
		let flavourText = '';
		let displayLeftNumber = 0;
		let displayRightNumber = 2;
		let displayLeftCycle = false;
		let displayRightCycle = false;
		let displayTopCycle = false;
		let displayBottomCycle = false;
		const processedStatsArr = [];
		let heightWeightArr = [];
		let encounterArr = [];
		if (dataReady) {
			// Types
			typeOne = typeData[0].name;
			const typeTwoExists = typeof typeData[1] === 'object';
			typeTwo = typeTwoExists ? typeData[1].name : null;

			// Abilities
			for (let i = 0; i < abilityData.length; i += 1) {
				const ability = abilityData[i];
				abilities.push({
					name: ability.names.filter((name) => name.language.name === language)[0].name,
					flavourText: selectAbilityFlavourText(ability.flavor_text_entries, language),
					hidden: ability.hidden,
				});
			}

			// Type effectiveness
			typeEffectivenessObj = generatePokemonTypeEffectiveness(typeData[0].damage_relations, typeTwoExists ? typeData[1].damage_relations : false, abilities);

			// Sprites
			spriteObj = baseData.sprites;

			// Flavour text (description)
			flavourText = selectSecondaryDisplayFlavourText(speciesData.flavor_text_entries, language);

			// Sprite display
			displayLeftNumber = pokedexNumber - 1;
			displayRightNumber = pokedexNumber + 1;
			displayLeftCycle = isValidPokedexNumber(displayLeftNumber);
			displayRightCycle = isValidPokedexNumber(displayRightNumber);
			displayTopCycle = (activeSprite - 1) >= 0;
			displayBottomCycle = (activeSprite + 1) <= 3;

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

			statisticsData.forEach(function (value, index) {
				this[index].name = value.names.filter((item) => item.language.name === language)[0].name;
			}, processedStatsArr);

			// Height & Weight
			heightWeightArr = [
				{
					name: 'Height',
					value: baseData.height,
				},
				{
					name: 'Weight',
					value: baseData.weight,
				},
			];

			// Encounters
			const generationOneData = [];
			const generationTwoData = [];
			const generationThreeData = [];
			const generationFourData = [];
			const generationFiveData = [];
			const generationSixData = [];
			const generationSevenData = [];

			// Group by generation
			// TODO: Make language dependent if possible
			encounterData.forEach((encounter) => {
				switch (encounter.version) {
					case 'Red':
					case 'Blue':
					case 'Yellow':
						generationOneData.push(encounter);
						break;
					case 'Gold':
					case 'Silver':
					case 'Crystal':
						generationTwoData.push(encounter);
						break;
					case 'Ruby':
					case 'Sapphire':
					case 'Emerald':
					case 'Fire Red':
					case 'Leaf Green':
						generationThreeData.push(encounter);
						break;
					case 'Diamond':
					case 'Pearl':
					case 'Platinum':
					case 'Heart Gold':
					case 'Soul Silver':
						generationFourData.push(encounter);
						break;
					case 'Black':
					case 'White':
					case 'Black 2':
					case 'White 2':
						generationFiveData.push(encounter);
						break;
					case 'X':
					case 'Y':
					case 'Omega Ruby':
					case 'Alpha Sapphire':
						generationSixData.push(encounter);
						break;
					case 'Sun':
					case 'Moon':
					case 'Ultra Sun':
					case 'Ultra Moon':
						generationSevenData.push(encounter);
						break;
					default:
						break;
				}
			});

			encounterArr = [
				{
					generation: 1,
					data: generationOneData,
				},
				{
					generation: 2,
					data: generationTwoData,
				},
				{
					generation: 3,
					data: generationThreeData,
				},
				{
					generation: 4,
					data: generationFourData,
				},
				{
					generation: 5,
					data: generationFiveData,
				},
				{
					generation: 6,
					data: generationSixData,
				},
				{
					generation: 7,
					data: generationSevenData,
				},
			];
		}

		return (
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
								{!dataReady ? (
									<div className="flex-center">
										<Wave color="#fff" />
									</div>
								) : (
									<>
										<div className="sprite-top">
											<div
												className="sprite-cycle top"
												onClick={this.onPrevSpriteClick}
												role="button"
												tabIndex={0}
												aria-label="Previous sprite"
												onKeyDown={this.onKeyDown}
											>
												{displayTopCycle
													&& <FaChevronUp color="#fff" />}
											</div>
										</div>
										<div className="sprite-middle">
											<div
												className="sprite-cycle left"
												onClick={this.onPrevPokemonClick}
												role="button"
												tabIndex={0}
												aria-label="Previous Pokemon"
												onKeyDown={this.onKeyDown}
											>
												{displayLeftCycle
													&& (
														<>
															<FaChevronLeft color="#fff" />
															<span className="nav-number-text">
																#
																{displayLeftNumber}
															</span>
														</>
													)}
											</div>
											<div className="sprite-wrapper">
												{Object.keys(spriteObj).map((spriteKey) => {
													const spriteUrl = spriteObj[spriteKey];
													if (!spriteUrl) return null;

													return (
														<Sprite
															spriteUrl={spriteUrl}
															spriteKey={spriteKey}
															activeSprite={spriteKey === spriteRefObj[activeSprite]}
															key={spriteKey}
														/>
													);
												})}
											</div>
											<div
												className="sprite-cycle right"
												onClick={this.onNextPokemonClick}
												role="button"
												tabIndex={0}
												aria-label="Next Pokemon"
												onKeyDown={this.onKeyDown}
											>
												{displayRightCycle
													&& <FaChevronRight color="#fff" />}
												<span className="nav-number-text">
													#
													{displayRightNumber}
												</span>
											</div>
										</div>
										<div className="sprite-bottom">
											<div
												className="sprite-cycle bottom"
												onClick={this.onNextSpriteClick}
												role="button"
												tabIndex={0}
												aria-label="Next sprite"
												onKeyDown={this.onKeyDown}
											>
												{displayBottomCycle
													&& <FaChevronDown color="#fff" />}
											</div>
										</div>
									</>
								)}
							</div>
							<div className="main-display-footer">
								<SpriteButton clickHandler={this.onSpriteButtonClick} />
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
									{!dataReady ? (
										<div className="number-display-wrapper flex-center">
											<Wave color="#fff" />
										</div>
									) : (
										<NumberDisplay
											pokemonInput={pokemonInput}
											onPokemonInput={this.onPokemonInput}
											onPokemonInputBlur={this.onPokemonInputBlur}
											onPokemonInputClick={this.onPokemonInputClick}
										/>
									)}
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
							{!dataReady ? (
								<div className="flex-center">
									<Wave color="#fff" />
								</div>
							) : (
								<SecondaryDisplay
									activeDisplay={activeSecondaryDisplay}
									flavourText={flavourText}
									statistics={processedStatsArr}
									heightWeight={heightWeightArr}
									typeEffectiveness={typeEffectivenessObj}
									abilities={abilities}
									encounters={encounterArr}
									evolutionChain={evolutionData}
								/>
							)}
						</div>
						<div className="grid-button-container">
							<GridButton clickHandler={this.onGridButtonClick} screen="flavourText" />
							<GridButton clickHandler={this.onGridButtonClick} screen="statistics" />
							<GridButton clickHandler={this.onGridButtonClick} screen="heightWeight" />
							<GridButton clickHandler={this.onGridButtonClick} screen="typeEffectiveness" />
							<GridButton clickHandler={this.onGridButtonClick} screen="abilities" />
							<GridButton clickHandler={this.onGridButtonClick} screen="encounters" />
							<GridButton clickHandler={this.onGridButtonClick} screen="evolutionChain" />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
						</div>
						<div className="misc-button-container">
							<div className="misc-button-left-col">
								<div
									className="white-grid-button"
									onClick={this.scrollUp}
									role="button"
									tabIndex={0}
									aria-label="Scroll secondary display up"
									onKeyDown={this.onKeyDown}
								/>
								<div
									className="white-grid-button"
									onClick={this.scrollDown}
									role="button"
									tabIndex={0}
									aria-label="Scroll secondary display down"
									onKeyDown={this.onKeyDown}
								/>
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
								{!dataReady ? (
									<div className="flex-center">
										<Wave color="#fff" />
									</div>
								) : (
									<TypeDisplay type={typeOne} />
								)}
							</div>
							<div className="type-display-wrapper">
								{!dataReady ? (
									<div className="flex-center">
										<Wave color="#fff" />
									</div>
								) : (
									<>
										{typeTwo
											&& <TypeDisplay type={typeTwo} />}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
