import React from 'react';

import axios from 'axios';
import { Wave } from 'better-react-spinkit';
import {
	FaChevronLeft,
	FaChevronRight,
	FaChevronUp,
	FaChevronDown,
} from 'react-icons/fa';

import Database from '../../utils/database';

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

// Useful object to ensure preferred order of sprites is correct
const spriteRef = [
	'front_default',
	'back_default',
	'front_female',
	'back_female',
	'front_shiny',
	'back_shiny',
	'front_shiny_female',
	'back_shiny_female',
];

export default class Pokedex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			database: new Database(),
			apiUrl: 'https://pokeapi.co/api/v2/',
			pokedexNumber: 1,
			pokemonInput: '#1 Bulbasaur',
			pokemonCry: new Audio(),
			activeSprite: 0,
			spriteArr: [],
			activeSecondaryDisplay: 'flavourText',
			language: 'en',
			baseData: [],
			speciesData: [],
			typeData: [],
			encounterData: [],
			abilityData: [],
			evolutionData: [],
			statisticsData: [],
			moveData: [],
			dataReady: false,
		};

		// Binding methods
		this.onNextPokemonClick = this.onNextPokemonClick.bind(this);
		this.onPrevPokemonClick = this.onPrevPokemonClick.bind(this);
		this.onNextSpriteClick = this.onNextSpriteClick.bind(this);
		this.onPrevSpriteClick = this.onPrevSpriteClick.bind(this);
		this.onGridButtonClick = this.onGridButtonClick.bind(this);
		this.onConfirmButtonClick = this.onConfirmButtonClick.bind(this);
		this.onSpriteButtonClick = this.onSpriteButtonClick.bind(this);
		this.onPokemonInput = this.onPokemonInput.bind(this);
		this.onPokemonInputBlur = this.onPokemonInputBlur.bind(this);
		this.onPokemonInputClick = this.onPokemonInputClick.bind(this);
		this.getRawData = this.getRawData.bind(this);
		this.getData = this.getData.bind(this);
		this.processEvolutionData = this.processEvolutionData.bind(this);
		this.processEncounterData = this.processEncounterData.bind(this);
		this.processMoveData = this.processMoveData.bind(this);
		this.searchPokemon = this.searchPokemon.bind(this);
		this.scrollUp = this.scrollUp.bind(this);
		this.scrollDown = this.scrollDown.bind(this);
	}

	componentDidMount() {
		const {
			database,
		} = this.state;

		// Initialise DB
		database.start().then(() => {
			// First load defaults to #1 (Bulbasaur)
			this.getData(false, false);
		}, (e) => {
			console.error(`Database couldn't be opened. Error: ${JSON.stringify(e)}`);
		});
	}

	// Click handlers
	onNextPokemonClick() {
		const {
			pokedexNumber,
			pokemonCry,
			dataReady,
		} = this.state;

		if (!dataReady) return;

		const nextPokedexNumber = pokedexNumber + 1;
		if (!isValidPokedexNumber(nextPokedexNumber)) return;

		this.setState({
			pokedexNumber: nextPokedexNumber, // Update Pokedex number in state
			pokemonInput: '',
			activeSprite: 0,
			spriteArr: [],
			activeSecondaryDisplay: 'flavourText',
			dataReady: false, // Add loading spinner
		});

		pokemonCry.removeAttribute('src');

		this.getData(nextPokedexNumber, false);
	}

	onPrevPokemonClick() {
		const {
			pokedexNumber,
			pokemonCry,
			dataReady,
		} = this.state;

		if (!dataReady) return;

		const prevPokedexNumber = pokedexNumber - 1;
		if (!isValidPokedexNumber(prevPokedexNumber)) return;

		this.setState({
			pokedexNumber: prevPokedexNumber, // Update Pokedex number in state
			pokemonInput: '',
			activeSprite: 0,
			spriteArr: [],
			activeSecondaryDisplay: 'flavourText',
			dataReady: false, // Add loading spinner
		});

		pokemonCry.removeAttribute('src');

		this.getData(prevPokedexNumber, false);
	}

	onNextSpriteClick() {
		const {
			activeSprite,
			spriteArr,
			dataReady,
		} = this.state;

		if (!dataReady) return;

		const nextSpriteNumber = activeSprite + 1;
		if (nextSpriteNumber > (spriteArr.length - 1)) return;

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
			pokemonCry,
			dataReady,
		} = this.state;

		if (!dataReady) return;

		const randomNumber = Math.floor(Math.random() * (maxPokedexNumber - 1) + 1);
		this.setState({
			pokedexNumber: randomNumber,
			activeSprite: 0,
			spriteArr: [],
			activeSecondaryDisplay: 'flavourText',
			dataReady: false,
		});

		pokemonCry.removeAttribute('src');

		this.getData(randomNumber, false);
	}

	onSpriteButtonClick() {
		const {
			dataReady,
			pokemonCry,
		} = this.state;

		if (!dataReady) return;

		pokemonCry.play();
	}

	static onKeyDown() {}

	onPokemonInput(event) {
		event.preventDefault();
		const {
			value,
		} = event.target;

		if (event.key === 'Enter') {
			const {
				pokedexNumber,
				pokemonCry,
			} = this.state;

			this.setState({
				pokedexNumber,
				pokemonInput: '',
				activeSprite: 0,
				spriteArr: [],
				activeSecondaryDisplay: 'flavourText',
				dataReady: false,
			});
			pokemonCry.removeAttribute('src');
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
			pokemonCry,
		} = this.state;

		this.setState({
			pokedexNumber,
			pokemonInput: '',
			activeSprite: 0,
			spriteArr: [],
			activeSecondaryDisplay: 'flavourText',
			dataReady: false,
		});
		pokemonCry.removeAttribute('src');
		this.searchPokemon(event.target.value);
	}

	onPokemonInputClick(event) {
		event.preventDefault();
		this.setState({
			pokemonInput: '',
		});
	}

	/**
	 * Fetches raw data from DB or API. If fetching from API, inserts into DB too.
	 * @param {Number} id - Unique identifier from API
	 * @param {String} type - API endpoint
	 * @param {Boolean} isEncounterData - Adjust for different endpoint format
	 * @returns {Array} Raw data array
	 */
	async getRawData(id, type, isEncounterData) {
		const {
			database,
			apiUrl,
		} = this.state;

		// Ensure id is an integer, string/integer treated as different keys in DB
		const idInt = Number(id);

		// Check if we have the response already in the DB
		let dbData = null;
		await database.readTransaction(type, idInt).then((data) => {
			if (data) dbData = data;
		});

		if (dbData) {
			// Encounter endpoint is in format /pokemon/[id]/encounters
			if (isEncounterData && typeof dbData.location_area_encounters !== 'string') {
				return dbData.location_area_encounters;
			}

			if (!isEncounterData) return dbData;
		}

		// If data not in DB, need to make a request
		if (isEncounterData) {
			return axios.get(`${apiUrl}${type}/${idInt}/encounters`).then((response) => {
				const responseData = response.data;
				return database.updateTransaction(type, idInt, {
					location_area_encounters: responseData,
				}).then(() => responseData);
			});
		}

		return axios.get(`${apiUrl}${type}/${idInt}`).then((response) => {
			const responseData = response.data;
			return database.createTransaction(type, responseData).then(() => responseData);
		});
	}

	/**
	 * Gets data on Pokemon using provided Pokedex number or Pokemon name
	 * @param {Number} id - Pokedex number
	 * @param {String} name - Pokemon name
	 */
	async getData(id, name) {
		const {
			apiUrl,
			pokedexNumber,
			pokemonCry,
			language,
		} = this.state;

		let baseData = [];
		let speciesData = [];
		const typeData = [];
		let encounterData = [];
		const abilityData = [];
		let evolutionData = [];
		const statisticsData = [];
		let moveData = [];
		const spriteArr = [];

		let pokemonToGet = pokedexNumber;
		if (id) {
			pokemonToGet = id;
		} else if (name) {
			try {
				await axios.get(`${apiUrl}pokemon/${name}/`).then((response) => {
					baseData = response.data;
					pokemonToGet = baseData.id;
				});
			} catch (e) {
				console.error(`getData -> Error: ${JSON.stringify(e)}`);
				alert('Error fetching Pokemon data. Please check the Pokemon name entered.');

				// If we fail to get data, revert back to current Pokemon
				this.getData(pokedexNumber, false);
			}
		}

		try {
			// First, get the base Pokemon data
			baseData = await this.getRawData(pokemonToGet, 'pokemon', false);

			// Add to sprite array from base response, only add non-null sprites
			const spriteObj = baseData.sprites;
			for (let i = 0; i < spriteRef.length; i += 1) {
				const spriteName = spriteRef[i];
				if (spriteObj[spriteName]) spriteArr.push(spriteObj[spriteName]);
			}

			// Process move data
			const processMovePromise = this.processMoveData(baseData.moves);

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
				([
					speciesData,
					encounterData,
				] = res);
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
			});

			// Set Pokemon input value
			const pokemonName = speciesData.names.filter((speciesName) => speciesName.language.name === language)[0].name;
			const pokemonInput = `#${pokemonToGet} ${pokemonName}`;

			// Process encounter data
			const processEncounterPromise = this.processEncounterData(encounterData);

			// After we have species data, we can get evolution line data
			const evolutionUrlArr = speciesData.evolution_chain.url.split('/');
			const rawEvolutionData = await this.getRawData(evolutionUrlArr[evolutionUrlArr.length - 2], 'evolution-chain', false);
			const processEvolutionPromise = this.processEvolutionData(rawEvolutionData);

			// Set source for Pokemon cry, requires import (importPokemonCry)
			const importCryPromise = importPokemonCry(pokemonToGet).then((a) => a.default);

			await Promise.all([
				processMovePromise,
				processEncounterPromise,
				processEvolutionPromise,
				importCryPromise,
			]).then((res) => {
				([
					moveData,
					encounterData,
					evolutionData,
				] = res);

				pokemonCry.src = res[3];
			});

			this.setState({
				pokedexNumber: pokemonToGet,
				pokemonInput,
				activeSprite: 0, // Always reset back to default image
				spriteArr,
				baseData,
				speciesData,
				typeData,
				encounterData,
				abilityData,
				evolutionData,
				statisticsData,
				moveData,
				dataReady: true, // Remove loading spinner
			});
		} catch (e) {
			console.error(`getData -> Error: ${JSON.stringify(e)}`);
			alert('Error fetching Pokemon data');

			// If we fail to get data, revert back to current Pokemon
			this.getData(pokedexNumber, false);
		}
	}

	async processEvolutionData(data) {
		const {
			language,
		} = this.state;

		const {
			chain,
			baby_trigger_item,
		} = data;

		const processedData = [];

		// Get name and sprite of evolution from API
		let evoSpeciesUrlArr = chain.species.url.split('/');
		let rawEvoSpeciesData = await this.getRawData(evoSpeciesUrlArr[evoSpeciesUrlArr.length - 2], 'pokemon-species', false);
		let evoBaseUrlArr = rawEvoSpeciesData.varieties[0].pokemon.url.split('/');
		let rawEvoBaseData = await this.getRawData(evoBaseUrlArr[evoBaseUrlArr.length - 2], 'pokemon', false);

		processedData.push({
			name: rawEvoSpeciesData.names.filter((name) => name.language.name === language)[0].name,
			sprite: rawEvoBaseData.sprites.front_default,
			stage: 0,
			evolutionDetails: chain.evolution_details,
		});

		const firstStageEvolutions = chain.evolves_to;
		for (let i = 0; i < firstStageEvolutions.length; i += 1) {
			const firstStageEvolution = firstStageEvolutions[i];

			// Get name and sprite of evolution from API
			evoSpeciesUrlArr = firstStageEvolution.species.url.split('/');
			rawEvoSpeciesData = await this.getRawData(evoSpeciesUrlArr[evoSpeciesUrlArr.length - 2], 'pokemon-species', false);
			evoBaseUrlArr = rawEvoSpeciesData.varieties[0].pokemon.url.split('/');
			rawEvoBaseData = await this.getRawData(evoBaseUrlArr[evoBaseUrlArr.length - 2], 'pokemon', false);

			processedData.push({
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

				processedData.push({
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

					processedData.push({
						name: rawEvoSpeciesData.names.filter((name) => name.language.name === language)[0].name,
						sprite: rawEvoBaseData.sprites.front_default,
						stage: 2,
						evolutionDetails: thirdStageEvolution.evolution_details,
					});
				}
			}
		}

		processedData.babyTriggerItem = baby_trigger_item;
		return processedData;
	}

	async processEncounterData(data) {
		const {
			language,
		} = this.state;

		const processedData = [];
		for (let i = 0; i < data.length; i += 1) {
			// Initially get location area data
			const rawLocation = data[i];
			const locationAreaUrlArr = rawLocation.location_area.url.split('/');
			const locationArea = await this.getRawData(locationAreaUrlArr[locationAreaUrlArr.length - 2], 'location-area', false);

			// Requires location area response
			// Generate a display name for location by checking if there is a name for location area
			// Location area may not have a name!
			const locationUrlArr = locationArea.location.url.split('/');
			const location = await this.getRawData(locationUrlArr[locationUrlArr.length - 2], 'location', false);
			const filteredLocationArea = locationArea.names.filter((name) => name.language.name === language);
			const filteredLocationAreaName = filteredLocationArea.length !== 0 ? filteredLocationArea[0].name : '';
			const locationName = location.names.filter((name) => name.language.name === language)[0].name;
			const locationDisplayName = `${locationName}${filteredLocationAreaName !== '' ? ` - ${filteredLocationAreaName}` : ''}`;

			const versionDetails = rawLocation.version_details;
			for (let j = 0; j < versionDetails.length; j += 1) {
				const rawVersion = versionDetails[j];
				const versionUrlArr = rawVersion.version.url.split('/');
				const version = await this.getRawData(versionUrlArr[versionUrlArr.length - 2], 'version', false);
				const versionName = version.names.filter((name) => name.language.name === language)[0].name;

				// Format is to have a list of locations for each version
				// Will group by generation in render method
				// Check if we have version in processedData to add to
				let foundVersion = false;
				for (let k = 0; k < processedData.length; k += 1) {
					if (processedData[k].version === versionName) {
						processedData[k].locations.push(locationDisplayName);
						foundVersion = true;
					}
				}

				// Add new index to processedData if we couldn't find existing index
				if (!foundVersion) {
					processedData.push({
						version: versionName,
						locations: [
							locationDisplayName,
						],
					});
				}
			}
		}

		return processedData;
	}

	async processMoveData(data) {
		const {
			language,
		} = this.state;

		const processedData = [];

		const processMove = (rawMove) => {
			const moveUrlArr = rawMove.move.url.split('/');
			return this.getRawData(moveUrlArr[moveUrlArr.length - 2], 'move', false).then((move) => {
				const versionGroupDetails = rawMove.version_group_details;
				for (let j = 0; j < versionGroupDetails.length; j += 1) {
					const versionGroupDetailsIteration = versionGroupDetails[j];
					const versionGroupName = versionGroupDetailsIteration.version_group.name;

					// Assign to generation based on version group
					let generation;
					switch (versionGroupName) {
						case 'red-blue':
						case 'yellow':
							generation = 1;
							break;
						case 'gold-silver':
						case 'crystal':
							generation = 2;
							break;
						case 'ruby-sapphire':
						case 'emerald':
						case 'firered-leafgreen':
						case 'colosseum':
						case 'xd':
							generation = 3;
							break;
						case 'diamond-pearl':
						case 'platinum':
						case 'heartgold-soulsilver':
							generation = 4;
							break;
						case 'black-white':
						case 'black-2-white-2':
							generation = 5;
							break;
						case 'x-y':
						case 'omega-ruby-alpha-sapphire':
							generation = 6;
							break;
						case 'sun-moon':
						case 'ultra-sun-ultra-moon':
							generation = 7;
							break;
						default:
							break;
					}

					const name = move.names.filter((moveName) => moveName.language.name === language)[0].name;
					const method = versionGroupDetailsIteration.move_learn_method.name;

					// Only add to processedData if one of generation/name/method is different to existing entry in array
					if (processedData.filter((m) => (m.generation === generation && m.name === name && m.method === method)).length === 0) {
						processedData.push({
							generation,
							name,
							method,
							levelLearnedAt: versionGroupDetailsIteration.level_learned_at,
						});
					}
				}
			});
		};

		const movePromises = [];
		for (let i = 0; i < data.length; i += 1) {
			movePromises.push(processMove(data[i]));
		}

		return Promise.all(movePromises).then(() => processedData);
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
			this.getData(Number(searchTerm), false);
			return;
		}

		// Search for a Pokemon name
		if (searchTerm.match(/[A-za-z]+/)) {
			this.getData(false, searchTerm.toLowerCase());
			return;
		}

		// Defaults to current Pokemon
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
			pokemonInput,
			activeSprite,
			spriteArr,
			activeSecondaryDisplay,
			language,
			baseData,
			speciesData,
			typeData,
			encounterData,
			abilityData,
			evolutionData,
			statisticsData,
			moveData,
			dataReady,
		} = this.state;

		// Declare variables for rendering
		let typeOne = '';
		let typeTwo = '';
		const abilities = [];
		let typeEffectivenessObj = {};
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
		let moveArr = [];
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

			// Flavour text (description)
			flavourText = selectSecondaryDisplayFlavourText(speciesData.flavor_text_entries, language);

			// Sprite display
			displayLeftNumber = pokedexNumber - 1;
			displayRightNumber = pokedexNumber + 1;
			displayLeftCycle = isValidPokedexNumber(displayLeftNumber);
			displayRightCycle = isValidPokedexNumber(displayRightNumber);
			displayTopCycle = (activeSprite - 1) >= 0;
			displayBottomCycle = (activeSprite + 1) < spriteArr.length;

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
			let generationOneData = [];
			let generationTwoData = [];
			let generationThreeData = [];
			let generationFourData = [];
			let generationFiveData = [];
			let generationSixData = [];
			let generationSevenData = [];

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

			// Moves
			generationOneData = [];
			generationTwoData = [];
			generationThreeData = [];
			generationFourData = [];
			generationFiveData = [];
			generationSixData = [];
			generationSevenData = [];

			// Group by generation
			moveData.forEach((move) => {
				let methodIndex = -1;
				switch (move.generation) {
					case 1:
						// TODO: Reduce duplicate code here
						methodIndex = generationOneData.findIndex((method) => method.name === move.method);
						if (methodIndex !== -1) {
							// If we already have method in generation, just need to add to move array
							generationOneData[methodIndex].moves.push({
								name: move.name,
								levelLearnedAt: move.levelLearnedAt,
							});
						} else {
							// Need to create new method for generation and add to newly created move array
							generationOneData.push({
								name: move.method,
								moves: [
									{
										name: move.name,
										levelLearnedAt: move.levelLearnedAt,
									},
								],
							});
						}
						break;
					case 2:
						methodIndex = generationTwoData.findIndex((method) => method.name === move.method);
						if (methodIndex !== -1) {
							// If we already have method in generation, just need to add to move array
							generationTwoData[methodIndex].moves.push({
								name: move.name,
								levelLearnedAt: move.levelLearnedAt,
							});
						} else {
							// Need to create new method for generation and add to newly created move array
							generationTwoData.push({
								name: move.method,
								moves: [
									{
										name: move.name,
										levelLearnedAt: move.levelLearnedAt,
									},
								],
							});
						}
						break;
					case 3:
						methodIndex = generationThreeData.findIndex((method) => method.name === move.method);
						if (methodIndex !== -1) {
							// If we already have method in generation, just need to add to move array
							generationThreeData[methodIndex].moves.push({
								name: move.name,
								levelLearnedAt: move.levelLearnedAt,
							});
						} else {
							// Need to create new method for generation and add to newly created move array
							generationThreeData.push({
								name: move.method,
								moves: [
									{
										name: move.name,
										levelLearnedAt: move.levelLearnedAt,
									},
								],
							});
						}
						break;
					case 4:
						methodIndex = generationFourData.findIndex((method) => method.name === move.method);
						if (methodIndex !== -1) {
							// If we already have method in generation, just need to add to move array
							generationFourData[methodIndex].moves.push({
								name: move.name,
								levelLearnedAt: move.levelLearnedAt,
							});
						} else {
							// Need to create new method for generation and add to newly created move array
							generationFourData.push({
								name: move.method,
								moves: [
									{
										name: move.name,
										levelLearnedAt: move.levelLearnedAt,
									},
								],
							});
						}
						break;
					case 5:
						methodIndex = generationFiveData.findIndex((method) => method.name === move.method);
						if (methodIndex !== -1) {
							// If we already have method in generation, just need to add to move array
							generationFiveData[methodIndex].moves.push({
								name: move.name,
								levelLearnedAt: move.levelLearnedAt,
							});
						} else {
							// Need to create new method for generation and add to newly created move array
							generationFiveData.push({
								name: move.method,
								moves: [
									{
										name: move.name,
										levelLearnedAt: move.levelLearnedAt,
									},
								],
							});
						}
						break;
					case 6:
						methodIndex = generationSixData.findIndex((method) => method.name === move.method);
						if (methodIndex !== -1) {
							// If we already have method in generation, just need to add to move array
							generationSixData[methodIndex].moves.push({
								name: move.name,
								levelLearnedAt: move.levelLearnedAt,
							});
						} else {
							// Need to create new method for generation and add to newly created move array
							generationSixData.push({
								name: move.method,
								moves: [
									{
										name: move.name,
										levelLearnedAt: move.levelLearnedAt,
									},
								],
							});
						}
						break;
					case 7:
						methodIndex = generationSevenData.findIndex((method) => method.name === move.method);
						if (methodIndex !== -1) {
							// If we already have method in generation, just need to add to move array
							generationSevenData[methodIndex].moves.push({
								name: move.name,
								levelLearnedAt: move.levelLearnedAt,
							});
						} else {
							// Need to create new method for generation and add to newly created move array
							generationSevenData.push({
								name: move.method,
								moves: [
									{
										name: move.name,
										levelLearnedAt: move.levelLearnedAt,
									},
								],
							});
						}
						break;
					default:
						break;
				}
			});

			moveArr = [
				{
					generation: 1,
					methods: generationOneData,
				},
				{
					generation: 2,
					methods: generationTwoData,
				},
				{
					generation: 3,
					methods: generationThreeData,
				},
				{
					generation: 4,
					methods: generationFourData,
				},
				{
					generation: 5,
					methods: generationFiveData,
				},
				{
					generation: 6,
					methods: generationSixData,
				},
				{
					generation: 7,
					methods: generationSevenData,
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
												{spriteArr.map((spriteUrl, index) => {
													const isActiveSprite = activeSprite === spriteArr.indexOf(spriteUrl);
													return (
														<Sprite
															spriteUrl={spriteUrl}
															activeSprite={isActiveSprite}
															key={index}
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
													&& (
														<>
															<FaChevronRight color="#fff" />
															<span className="nav-number-text">
																#
																{displayRightNumber}
															</span>
														</>
													)}

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
									noWildEncounters={encounterData.length === 0}
									evolutionChain={evolutionData}
									moves={moveArr}
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
							<GridButton clickHandler={this.onGridButtonClick} screen="moves" />
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
