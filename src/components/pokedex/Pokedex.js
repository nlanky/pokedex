// React
import React from 'react';

// node modules
import axios from 'axios';
import { Wave } from 'better-react-spinkit';
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';

// Database
import Database from '../../utils/database';

// Common functions
import {
	maxPokedexNumber,
	generatePokemonTypeEffectiveness,
	selectSecondaryDisplayFlavourText,
	selectAbilityFlavourText,
	importPokemonCry,
	isValidPokedexNumber,
	jsonErrorReplacer,
} from '../../utils/common';

// Components
import DirectionalPad from '../directionalPad';
import GridButton from '../gridButton';
import HingeContainer from '../hingeContainer';
import NumberDisplay from '../numberDisplay';
import RandomiseButton from '../randomiseButton';
import ScreenHeader from '../screenHeader';
import ScrollButton from '../scrollButton';
import SecondaryDisplay from '../secondaryDisplay';
import SlimButton from '../slimButton';
import SpriteButton from '../spriteButton';
import SpriteContainer from '../spriteContainer';
import TypeDisplay from '../typeDisplay';
import Vent from '../vent';
import WalkthroughButton from '../walkthroughButton';

// CSS
import '../../styles/app.scss';

// Background image
import background from '../../assets/images/background.jpg';

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

// Walkthrough steps
const walkthroughSteps = [
	// element (CSS selector for step)
	// intro (tooltip text)
	// position (position of tooltip)
	// tooltipClass (CSS class of tooltip)
	// highlightClass (CSS class of helper layer)
	{
		element: '.walkthrough-button',
		intro: 'Toggle the walkthrough at any time using this button',
		position: 'bottom',
	},
	{
		element: '.sprite-cycle.left',
		intro: 'Go to the previous Pok&eacute;mon (if applicable)',
		position: 'bottom',
	},
	{
		element: '.sprite-cycle.right',
		intro: 'Go to the next Pok&eacute;mon (if applicable)',
		position: 'bottom',
	},
	{
		element: '.sprite-cycle.top',
		intro: 'Go to the previous sprite (if applicable)',
		position: 'bottom',
	},
	{
		element: '.sprite-cycle.bottom',
		intro: 'Go to the next sprite (if applicable)',
		position: 'bottom',
	},
	{
		element: '.sprite-button',
		intro: 'Play the Pok&eacute;mon\'s cry',
		position: 'bottom',
	},
	{
		element: '.slim-button.walkthroughFirstSprite',
		intro: 'Go to the first sprite',
		position: 'bottom',
	},
	{
		element: '.slim-button.walkthroughLastSprite',
		intro: 'Go to the last sprite',
		position: 'bottom',
	},
	{
		element: '.number-display-wrapper',
		intro: 'Search for a Pok&eacute;mon using their name or Pok&eacute;dex number',
		position: 'bottom',
	},
	{
		element: '.dpad-wrapper',
		intro: 'Use the D-pad as an alternative to the arrows on the left display',
		position: 'bottom',
	},
	{
		element: '.grid-button.flavourText',
		intro: 'Show flavour text (description)',
		position: 'bottom',
	},
	{
		element: '.grid-button.statistics',
		intro: 'Show statistics',
		position: 'bottom',
	},
	{
		element: '.grid-button.heightWeight',
		intro: 'Show height and weight',
		position: 'bottom',
	},
	{
		element: '.grid-button.typeEffectiveness',
		intro: 'Show type effectiveness when being attacked',
		position: 'bottom',
	},
	{
		element: '.grid-button.abilities',
		intro: 'Show abilities',
		position: 'bottom',
	},
	{
		element: '.grid-button.encounters',
		intro: 'Show wild encounter locations',
		position: 'bottom',
	},
	{
		element: '.grid-button.evolutionChain',
		intro: 'Show evolution chain',
		position: 'bottom',
	},
	{
		element: '.grid-button.moves',
		intro: 'Show moves',
		position: 'bottom',
	},
	{
		element: '.grid-button.varieties',
		intro: 'Show varieties (including mega evolutions)',
		position: 'bottom',
	},
	{
		element: '.grid-button.eggGroups',
		intro: 'Show egg groups',
		position: 'bottom',
	},
	{
		element: '.white-grid-button.up',
		intro: 'Scroll the right display up',
		position: 'bottom',
	},
	{
		element: '.white-grid-button.down',
		intro: 'Scroll the right display down',
		position: 'bottom',
	},
	{
		element: '.slim-button.walkthroughScrollTop',
		intro: 'Scroll to the top of the right display',
		position: 'bottom',
	},
	{
		element: '.slim-button.walkthroughScrollBottom',
		intro: 'Scroll to the bottom of the right display',
		position: 'bottom',
	},
	{
		element: '.randomise-button',
		intro: 'Go to a random Pok&eacute;mon',
		position: 'bottom',
	},
];

// Setting background image that was imported
document.getElementById('root').style.backgroundImage = `url('${background}')`;

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
			varietyData: [],
			eggGroupData: [],
			dataReady: false,
			showWalkthrough: false,
		};

		// Binding methods
		this.onNextPokemonClick = this.onNextPokemonClick.bind(this);
		this.onPrevPokemonClick = this.onPrevPokemonClick.bind(this);
		this.onNextSpriteClick = this.onNextSpriteClick.bind(this);
		this.onPrevSpriteClick = this.onPrevSpriteClick.bind(this);
		this.onGridButtonClick = this.onGridButtonClick.bind(this);
		this.onRandomiseButtonClick = this.onRandomiseButtonClick.bind(this);
		this.onSpriteButtonClick = this.onSpriteButtonClick.bind(this);
		this.onPokemonInput = this.onPokemonInput.bind(this);
		this.onPokemonInputBlur = this.onPokemonInputBlur.bind(this);
		this.onPokemonInputClick = this.onPokemonInputClick.bind(this);
		this.onWalkthroughToggle = this.onWalkthroughToggle.bind(this);
		this.onWalkthroughExit = this.onWalkthroughExit.bind(this);
		this.onSlimButtonOneClick = this.onSlimButtonOneClick.bind(this);
		this.onSlimButtonTwoClick = this.onSlimButtonTwoClick.bind(this);
		this.onSlimButtonThreeClick = this.onSlimButtonThreeClick.bind(this);
		this.onSlimButtonFourClick = this.onSlimButtonFourClick.bind(this);
		this.getRawData = this.getRawData.bind(this);
		this.getData = this.getData.bind(this);
		this.processEvolutionData = this.processEvolutionData.bind(this);
		this.processEncounterData = this.processEncounterData.bind(this);
		this.processMoveData = this.processMoveData.bind(this);
		this.processVarietyData = this.processVarietyData.bind(this);
		this.processEggGroupData = this.processEggGroupData.bind(this);
		this.searchPokemon = this.searchPokemon.bind(this);
		this.scrollUp = this.scrollUp.bind(this);
		this.scrollDown = this.scrollDown.bind(this);
	}

	componentDidMount() {
		const {
			database,
		} = this.state;

		// Initialise DB
		database.start().then(() => (
			// Check if user has seen walkthrough before
			database.readTransaction('settings', 0).then((walkthroughSeen) => {
				// If setting doesn't exist, show walkthrough and save setting to database
				if (typeof walkthroughSeen === 'undefined') {
					return database.createTransaction('settings', {
						id: 0,
						walkthroughSeen: true,
					}).then(() => {
						this.setState({
							showWalkthrough: true,
						});

						// First load defaults to #1 (Bulbasaur)
						return this.getData(false, false);
					}, (e) => {
						console.error(`Pokedex.componentDidMount -> Could not create setting in database. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
					});
				}

				return this.getData(false, false);
			}, (e) => {
				console.error(`Pokedex.componentDidMount -> Could not retrieve settings from database. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
			})
		), (e) => {
			console.error(`Pokedex.componentDidMount -> Database couldn't be opened. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
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

		// Reset scroll position on secondary display
		document.getElementById('secondary_display').scrollTop = 0;

		this.setState({
			activeSecondaryDisplay: screen,
		});
	}

	onRandomiseButtonClick() {
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

	onWalkthroughToggle() {
		const {
			showWalkthrough,
		} = this.state;

		this.setState({
			showWalkthrough: !showWalkthrough,
		});
	}

	onWalkthroughExit() {
		this.setState({
			showWalkthrough: false,
		});
	}

	onSlimButtonOneClick() {
		const {
			dataReady,
		} = this.state;

		if (!dataReady) return;

		this.setState({
			activeSprite: 0,
		});
	}

	onSlimButtonTwoClick() {
		const {
			spriteArr,
			dataReady,
		} = this.state;

		if (!dataReady) return;

		this.setState({
			activeSprite: spriteArr.length - 1,
		});
	}

	onSlimButtonThreeClick() {
		const {
			dataReady,
		} = this.state;

		if (!dataReady) return;

		document.getElementById('secondary_display').scrollTop = 0;
	}

	onSlimButtonFourClick() {
		const {
			dataReady,
		} = this.state;

		if (!dataReady) return;

		const secondaryDisplay = document.getElementById('secondary_display');
		secondaryDisplay.scrollTop = secondaryDisplay.scrollHeight;
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
		try {
			dbData = await database.readTransaction(type, idInt);
		} catch (e) {
			console.error(`getRawData(${id}, ${type}, ${isEncounterData}) -> Could not read data from database. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
			return Promise.reject(e);
		}

		return new Promise((resolve, reject) => {
			if (dbData) {
				if (!isEncounterData) return resolve(dbData);

				// location_area_encounters is a URL in form /pokemon/[id]/encounters
				// before we overwrite after getting encounter data
				if (typeof dbData.location_area_encounters !== 'string') return resolve(dbData.location_area_encounters);
			}

			// If data not in DB, need to make a request
			if (isEncounterData) {
				return axios.get(`${apiUrl}${type}/${idInt}/encounters`).then((response) => {
					const responseData = response.data;
					return database.updateTransaction(type, idInt, {
						location_area_encounters: responseData,
					}).then(() => resolve(responseData), (e) => {
						console.error(`getRawData(${id}, ${type}, ${isEncounterData}) -> Could not write encounter data to database. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
						return reject(e);
					});
				}, (e) => {
					console.error(`getRawData(${id}, ${type}, ${isEncounterData}) -> Could not retrieve encounter data from API. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
					return reject(e);
				});
			}

			return axios.get(`${apiUrl}${type}/${idInt}`).then((response) => {
				const responseData = response.data;
				return database.createTransaction(type, responseData).then(() => resolve(responseData), (e) => {
					console.error(`getRawData(${id}, ${type}, ${isEncounterData}) -> Could not write data to database. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
					return reject(e);
				});
			}, (e) => {
				console.error(`getRawData(${id}, ${type}, ${isEncounterData}) -> Could not retrieve data from API. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
				return reject(e);
			});
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
		let varietyData = [];
		let eggGroupData = [];

		let pokemonToGet = pokedexNumber;
		if (id) {
			pokemonToGet = id;
		} else if (name) {
			try {
				const baseResponseFromName = await axios.get(`${apiUrl}pokemon/${name}/`);
				baseData = baseResponseFromName.data;
				pokemonToGet = baseData.id;
			} catch (e) {
				console.error(`getData(${id}, ${name}) -> Could not retrieve data for provided name. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
				alert('Error fetching Pokemon data. Please check the Pokemon name entered.');

				// If we fail to get data, revert back to current Pokemon
				this.getData(pokedexNumber, false);
				return;
			}
		}

		// First, get the base Pokemon data
		try {
			baseData = await this.getRawData(pokemonToGet, 'pokemon', false);
		} catch (e) {
			console.error(`getData(${id}, ${name}) -> Could not retrieve Pokemon base data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
			alert('Could not find Pokemon with provided name.');
			this.getData(pokedexNumber, false);
			return;
		}

		// Add to sprite array from base response, only add non-null sprites
		const spriteObj = baseData.sprites;
		for (let i = 0; i < spriteRef.length; i += 1) {
			const spriteName = spriteRef[i];
			if (spriteObj[spriteName]) spriteArr.push(spriteObj[spriteName]);
		}

		// Used to get identifier for species request
		const speciesUrlArr = baseData.species.url.split('/');

		// Species
		const speciesPromise = new Promise((resolve, reject) => {
			this.getRawData(speciesUrlArr[speciesUrlArr.length - 2], 'pokemon-species', false).then((response) => {
				speciesData = response;

				// Used to get identifier for evolution chain request
				const evolutionUrlArr = speciesData.evolution_chain.url.split('/');
				const evolutionPromise = this.processEvolutionData(evolutionUrlArr[evolutionUrlArr.length - 2]);

				const speciesPromises = [
					evolutionPromise,
				];

				// Add requests to get egg group data
				const eggGroups = speciesData.egg_groups;
				const numberEggGroups = eggGroups.length;
				for (let j = 0; j < numberEggGroups; j += 1) {
					const eggGroupUrlArr = eggGroups[j].url.split('/');
					speciesPromises.push(this.getRawData(eggGroupUrlArr[eggGroupUrlArr.length - 2], 'egg-group', false));
				}

				// Add requests to get variety data
				const {
					varieties,
				} = speciesData;

				const numberVarieties = varieties.length;
				for (let k = 0; k < numberVarieties; k += 1) {
					const variety = varieties[k];

					// Ignore the default variety as we're already showing data for it
					const varietyUrlArr = variety.pokemon.url.split('/');

					const varietyPromise = new Promise((resolveVariety, rejectVariety) => {
						this.getRawData(varietyUrlArr[varietyUrlArr.length - 2], 'pokemon', false).then((varietyResponse) => {
							// TODO: Check if we only need first index of forms
							const formUrlArr = varietyResponse.forms[0].url.split('/');
							this.getRawData(formUrlArr[formUrlArr.length - 2], 'pokemon-form', false).then((formResponse) => {
								resolveVariety(formResponse);
							}, (e) => {
								console.error(`getData(${id}, ${name}) -> Could not retrieve form data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
								rejectVariety(e);
							});
						}, (e) => {
							console.error(`getData(${id}, ${name}) -> Could not retrieve variety data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
							rejectVariety(e);
						});
					});
					speciesPromises.push(varietyPromise);
				}

				Promise.all(speciesPromises).then((res) => {
					([
						evolutionData,
					] = res);

					const fallbackName = speciesData.names.filter((speciesName) => speciesName.language.name === language)[0].name;

					// There will always be 1 or 2 egg groups
					if (numberEggGroups === 1) {
						// Process egg group
						eggGroupData = this.processEggGroupData([
							res[1],
						]);

						// Any remaining responses will be varieties
						varietyData = this.processVarietyData(res.splice(2), fallbackName);
					} else {
						// Process egg groups
						eggGroupData = this.processEggGroupData([
							res[1],
							res[2],
						]);

						// Any remaining responses will be varieties
						varietyData = this.processVarietyData(res.splice(3), fallbackName);
					}

					resolve();
				}, (e) => {
					console.error(`getData(${id}, ${name}) -> Could not resolve species data promises. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
					reject(e);
				});
			}, (e) => {
				console.error(`getData(${id}, ${name}) -> Could not retrieve species data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
				reject(e);
			});
		});

		// For encounters, need to make request to endpoint in base response and process
		const encounterPromise = new Promise((resolve, reject) => {
			this.getRawData(pokemonToGet, 'pokemon', true).then((response) => this.processEncounterData(response).then((data) => {
				encounterData = data;
				resolve();
			}, (e) => {
				console.error(`getData(${id}, ${name}) -> Could not process encounter data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
				reject(e);
			}), (e) => {
				console.error(`getData(${id}, ${name}) -> Could not retrieve encounter data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
				reject(e);
			});
		});

		// Promises that require base data
		// Use base data to make requests to other API endpoints
		const promises = [
			importPokemonCry(pokemonToGet).then((a) => a.default), // Pokemon cry
			speciesPromise, // Species & Evolution Chain
			encounterPromise, // Encounters
			this.processMoveData(baseData.moves), // Moves
			this.getRawData(1, 'stat', false), // Statistic - HP
			this.getRawData(2, 'stat', false), // Statistic - Attack
			this.getRawData(3, 'stat', false), // Statistic - Defense
			this.getRawData(4, 'stat', false), // Statistic - Special Attack
			this.getRawData(5, 'stat', false), // Statistic - Special Defense
			this.getRawData(6, 'stat', false), // Statistic - Speed
		];

		// Pokemon may have 1 or 2 types, sort by slot
		const typeArr = baseData.types.sort((a, b) => a.slot - b.slot);
		const typeOneUrlArr = typeArr[0].type.url.split('/');
		promises.push(this.getRawData(typeOneUrlArr[typeOneUrlArr.length - 2], 'type', false));
		if (typeArr[1]) {
			const typeTwoUrlArr = typeArr[1].type.url.split('/');
			promises.push(this.getRawData(typeTwoUrlArr[typeTwoUrlArr.length - 2], 'type', false));
		}

		// Pokemon may have up to 3 abilities
		const abilityArr = baseData.abilities.sort((a, b) => a.slot - b.slot);
		const abilityOneUrlArr = abilityArr[0].ability.url.split('/');
		promises.push(this.getRawData(abilityOneUrlArr[abilityOneUrlArr.length - 2], 'ability', false));
		if (abilityArr[1]) {
			const abilityTwoUrlArr = abilityArr[1].ability.url.split('/');
			promises.push(this.getRawData(abilityTwoUrlArr[abilityTwoUrlArr.length - 2], 'ability', false));
			if (abilityArr[2]) {
				const abilityThreeUrlArr = abilityArr[2].ability.url.split('/');
				promises.push(this.getRawData(abilityThreeUrlArr[abilityThreeUrlArr.length - 2], 'ability', false));
			}
		}

		// Can make these requests synchronously, only relying on base data
		let responses;
		try {
			responses = await Promise.all(promises);
		} catch (e) {
			console.error(`getData(${id}, ${name}) -> Could not resolve base data promises. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
			alert('Error fetching Pokemon data.');
			this.getData(pokedexNumber, false);
			return;
		}

		// Set file source for Pokemon cry
		const {
			0: crySource, // Index 0 of responses
		} = responses;

		pokemonCry.src = crySource;

		// Set move data
		const {
			3: moveResponse, // Index 3 of responses
		} = responses;

		moveData = moveResponse;

		// Set statistics data
		statisticsData.push(
			responses[4],
			responses[5],
			responses[6],
			responses[7],
			responses[8],
			responses[9],
		);

		// Set type and ability data
		typeData.push(responses[10]);
		const noOfTypes = typeArr.length;
		const noOfAbilities = abilityArr.length;
		if (noOfTypes === 1) {
			switch (noOfAbilities) {
				case 1:
					abilityData.push(responses[11]);
					break;
				case 2:
					abilityData.push(responses[11]);
					abilityData.push(responses[12]);
					break;
				case 3:
					abilityData.push(responses[11]);
					abilityData.push(responses[12]);
					abilityData.push(responses[13]);
					break;
				default:
					break;
			}
		} else {
			typeData.push(responses[11]);
			switch (noOfAbilities) {
				case 1:
					abilityData.push(responses[12]);
					break;
				case 2:
					abilityData.push(responses[12]);
					abilityData.push(responses[13]);
					break;
				case 3:
					abilityData.push(responses[12]);
					abilityData.push(responses[13]);
					abilityData.push(responses[14]);
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

		// Set Pokemon input value
		const pokemonName = speciesData.names.filter((speciesName) => speciesName.language.name === language)[0].name;
		const pokemonInput = `#${pokemonToGet} ${pokemonName}`;

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
			eggGroupData,
			varietyData,
			moveData,
			dataReady: true, // Remove loading spinner
		});
	}

	async processEvolutionData(evolutionUrl) {
		const {
			language,
		} = this.state;

		const data = await this.getRawData(evolutionUrl, 'evolution-chain', false);
		const {
			chain,
		} = data;

		const processedData = [];
		const processEvolution = (evolution, stage) => new Promise((resolve, reject) => {
			// Get name and sprite of evolution from API
			const speciesUrlArr = evolution.species.url.split('/');
			return this.getRawData(speciesUrlArr[speciesUrlArr.length - 2], 'pokemon-species', false).then((speciesData) => {
				const baseUrlArr = speciesData.varieties[0].pokemon.url.split('/');
				return this.getRawData(baseUrlArr[baseUrlArr.length - 2], 'pokemon', false).then((baseData) => {
					const evolutionDetails = evolution.evolution_details;
					const processedEvolutionDetails = [];
					for (let i = 0; i < evolutionDetails.length; i += 1) {
						const evolutionDetail = evolutionDetails[i];
						const detailKeys = Object.keys(evolutionDetail);
						const iterationPromises = [];
						const keysToReplace = [];
						for (let j = 0; j < detailKeys.length; j += 1) {
							const detailKey = detailKeys[j];
							const keyData = evolutionDetail[detailKey];
							if (keyData !== null && typeof keyData === 'object') {
								const urlArr = keyData.url.split('/');
								iterationPromises.push(this.getRawData(urlArr[urlArr.length - 2], urlArr[urlArr.length - 3], false));
								keysToReplace.push(detailKey);
							}
						}

						// TODO: Investigate processing these promises at the same time
						// TODO: Issue with same requests overlapping similarly to locations
						Promise.all(iterationPromises).then((res) => {
							// Replace keys in evolution details with responses
							for (let k = 0; k < keysToReplace.length; k += 1) {
								evolutionDetail[keysToReplace[k]] = res[k].names.filter((name) => name.language.name === language)[0].name;
							}

							processedEvolutionDetails.push(evolutionDetail);
						}, (e) => {
							console.error(`processEvolution(${evolution.species.name}) -> Could not retrieve evolution detail data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
							reject(e);
						});
					}

					processedData.push({
						pokedexNumber: baseData.id,
						name: speciesData.names.filter((name) => name.language.name === language)[0].name,
						sprite: baseData.sprites.front_default,
						stage,
						evolutionDetails: processedEvolutionDetails,
					});

					// Return evolves_to in order to loop through again
					resolve(evolution.evolves_to);
				}, (e) => {
					console.error(`processEvolution(${evolution.species.name}) -> Could not retrieve base data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
					reject(e);
				});
			}, (e) => {
				console.error(`processEvolution(${evolution.species.name}) -> Could not retrieve species data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
				reject(e);
			});
		});

		const sortEvolutionsByStage = (a, b) => {
			if (a.stage < b.stage) return -1;
			if (a.stage > b.stage) return 1;

			return a.id - b.id;
		};

		// Add first Pokemon in chain
		const stageOnePromises = [
			processEvolution(chain, 0),
		];

		// Then loop through each evolves_to array at each evolution stage
		const firstStageEvolvesTo = chain.evolves_to;
		for (let i = 0; i < firstStageEvolvesTo.length; i += 1) {
			stageOnePromises.push(processEvolution(firstStageEvolvesTo[i], 1));
		}

		const stageTwoPromises = [];
		const stageOneResponses = await Promise.all(stageOnePromises);

		// First response will be first Pokemon from chain
		// This will have been dealt with already in processEvolution (added to processedData)
		stageOneResponses.shift();
		for (let j = 0; j < stageOneResponses.length; j += 1) {
			const evolutions = stageOneResponses[j];
			const numberEvolutions = evolutions.length;
			if (numberEvolutions !== 0) {
				for (let k = 0; k < numberEvolutions; k += 1) {
					stageTwoPromises.push(processEvolution(evolutions[k], 2));
				}
			}
		}

		const stageThreePromises = [];
		const stageTwoResponses = await Promise.all(stageTwoPromises);
		for (let l = 0; l < stageTwoResponses.length; l += 1) {
			const evolutions = stageTwoResponses[l];
			const numberEvolutions = evolutions.length;
			if (numberEvolutions !== 0) {
				for (let m = 0; m < numberEvolutions; m += 1) {
					stageThreePromises.push(processEvolution(evolutions[m], 3));
				}
			}
		}

		// Order may be wrong if later promises resolved first
		// Need to sort by stage and then Pokedex number
		return Promise.all(stageThreePromises).then(() => processedData.sort(sortEvolutionsByStage));
	}

	async processEncounterData(data) {
		const {
			language,
		} = this.state;

		const processedData = [];

		const processEncounter = (rawLocation) => new Promise((resolve, reject) => {
			// Initially get location area data
			const areaUrlArr = rawLocation.location_area.url.split('/');

			const promises = [
				this.getRawData(areaUrlArr[areaUrlArr.length - 2], 'location-area', false),
			];

			// Can also get details of all versions this location applies to at same time
			const versionDetails = rawLocation.version_details;
			const versionNumber = versionDetails.length;
			for (let i = 0; i < versionNumber; i += 1) {
				const versionUrlArr = versionDetails[i].version.url.split('/');
				promises.push(this.getRawData(versionUrlArr[versionUrlArr.length - 2], 'version', false));
			}

			Promise.all(promises).then((responses) => {
				// First response will be location area
				const [
					locationArea,
				] = responses;

				// Remove location area response, should have versions remaining
				responses.shift();

				// Use location area response to get location
				const locationUrlArr = locationArea.location.url.split('/');
				this.getRawData(locationUrlArr[locationUrlArr.length - 2], 'location', false).then((location) => {
					// Generate a display name for location by checking if there is a name for location area
					// Location area may not have a name!
					// First response will be location
					const filteredAreaNames = locationArea.names.filter((name) => name.language.name === language);

					// Sanity check in case there is no location area name
					const filteredAreaName = filteredAreaNames.length !== 0 ? filteredAreaNames[0].name : '';
					const locationName = location.names.filter((name) => name.language.name === language)[0].name;
					const locationDisplayName = `${locationName}${filteredAreaName !== '' ? ` - ${filteredAreaName}` : ''}`;

					// Loop through versions, adding to processedData
					for (let j = 0; j < responses.length; j += 1) {
						const version = responses[j];
						const versionName = version.names.filter((name) => name.language.name === language)[0].name;

						// Format is to have a list of locations for each version
						// Will group by generation in render method
						// Check if we have version in processedData to add to
						const versionIndex = processedData.findIndex((element) => element.version === versionName);
						if (versionIndex !== -1) {
							processedData[versionIndex].locations.push(locationDisplayName);
						} else {
							// Add new index to processedData if we couldn't find existing index
							processedData.push({
								version: versionName,
								locations: [
									locationDisplayName,
								],
							});
						}
					}

					resolve();
				}, (e) => {
					console.error(`processEncounterData(${rawLocation.location_area.name}) -> Could not retrieve location data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
					reject(e);
				});
			}, (e) => {
				console.error(`processEncounterData(${rawLocation.location_area.name}) -> Could not retrieve location area or version data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
				reject(e);
			});
		});

		// TODO: Issue with inserting same version data to database at the same time
		// TODO: Refactor to process encounters at same time rather than using await
		for (let i = 0; i < data.length; i += 1) {
			await processEncounter(data[i]);
		}

		return processedData;
	}

	async processMoveData(data) {
		const {
			language,
		} = this.state;

		const processedData = [];

		const processMove = (rawMove) => new Promise((resolve, reject) => {
			const moveUrlArr = rawMove.move.url.split('/');
			this.getRawData(moveUrlArr[moveUrlArr.length - 2], 'move', false).then((move) => {
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

				resolve();
			}, (e) => {
				console.error(`processMoveData -> Could not retrieve move data. Error: ${JSON.stringify(e, jsonErrorReplacer)}`);
				reject(e);
			});
		});

		const movePromises = [];
		for (let i = 0; i < data.length; i += 1) {
			movePromises.push(processMove(data[i]));
		}

		return new Promise((resolve, reject) => {
			Promise.all(movePromises).then(() => resolve(processedData), (e) => reject(e));
		});
	}

	processVarietyData(data, fallbackName) {
		const {
			language,
		} = this.state;

		const varietyData = [];
		for (let i = 0; i < data.length; i += 1) {
			const variety = data[i];
			let displayName = fallbackName;
			const formNameArr = variety.form_names.filter((varietyName) => varietyName.language.name === language);
			if (formNameArr.length !== 0) displayName = formNameArr[0].name;
			else {
				const namesArr = variety.names.filter((varietyName) => varietyName.language.name === language);
				if (namesArr.length !== 0) displayName = namesArr[0].name;
			}

			varietyData.push({
				name: displayName,
				sprite: variety.sprites.front_default,
			});
		}

		return varietyData;
	}

	processEggGroupData(data) {
		const {
			language,
		} = this.state;

		const eggGroupData = [];
		for (let i = 0; i < data.length; i += 1) {
			const eggGroup = data[i];
			eggGroupData.push({
				name: eggGroup.names.filter((eggGroupName) => eggGroupName.language.name === language)[0].name,
				numberSpecies: eggGroup.pokemon_species.length,
			});
		}

		return eggGroupData;
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

		document.getElementById('secondary_display').scrollTop -= 20;
	}

	scrollDown() {
		const {
			dataReady,
		} = this.state;

		if (!dataReady) return;

		document.getElementById('secondary_display').scrollTop += 20;
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
			varietyData,
			eggGroupData,
			dataReady,
			showWalkthrough,
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
			const {
				height,
				weight,
			} = baseData;

			heightWeightArr = [
				{
					name: 'Height',
					value: height,
				},
				{
					name: 'Weight',
					value: weight,
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
					case 'FireRed':
					case 'LeafGreen':
						generationThreeData.push(encounter);
						break;
					case 'Diamond':
					case 'Pearl':
					case 'Platinum':
					case 'HeartGold':
					case 'SoulSilver':
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
				<Steps
					enabled={showWalkthrough}
					steps={walkthroughSteps}
					initialStep={0}
					onExit={this.onWalkthroughExit}
				/>
				<div className="left-screen">
					<ScreenHeader left />
					<div className="left-screen-content">
						<div className="main-display-wrapper">
							<div className="main-display-cut" />
							<SpriteContainer
								dataReady={dataReady}
								prevSprite={this.onPrevSpriteClick}
								nextPokemon={this.onNextPokemonClick}
								nextSprite={this.onNextSpriteClick}
								prevPokemon={this.onPrevPokemonClick}
								displayTopCycle={displayTopCycle}
								displayRightCycle={displayRightCycle}
								displayBottomCycle={displayBottomCycle}
								displayLeftCycle={displayLeftCycle}
								displayLeftNumber={displayLeftNumber}
								displayRightNumber={displayRightNumber}
								activeSprite={activeSprite}
								spriteArr={spriteArr}
							/>
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
								<WalkthroughButton
									clickHandler={this.onWalkthroughToggle}
								/>
							</div>
							<div className="left-screen-footer-middle-col">
								<div className="left-screen-footer-row">
									<SlimButton
										colour="#D72113"
										clickHandler={this.onSlimButtonOneClick}
										label="walkthroughFirstSprite"
									/>
									<SlimButton
										colour="#fff"
										noMargin
										clickHandler={this.onSlimButtonTwoClick}
										label="walkthroughLastSprite"
									/>
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
				<HingeContainer />
				<div className="right-screen">
					<ScreenHeader />
					<div className="right-screen-content">
						<div className="right-screen-content-wrapper">
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
										varieties={varietyData}
										eggGroups={eggGroupData}
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
								<GridButton clickHandler={this.onGridButtonClick} screen="varieties" />
								<GridButton clickHandler={this.onGridButtonClick} screen="eggGroups" />
							</div>
							<div className="misc-button-container">
								<div className="misc-button-left-col">
									<ScrollButton
										directionUp
										clickHandler={this.scrollUp}
									/>
									<ScrollButton
										clickHandler={this.scrollDown}
									/>
								</div>
								<div className="misc-button-right-col">
									<div className="misc-button-row">
										<SlimButton
											clickHandler={this.onSlimButtonThreeClick}
											label="walkthroughScrollTop"
										/>
										<SlimButton
											noMargin
											clickHandler={this.onSlimButtonFourClick}
											label="walkthroughScrollBottom"
										/>
									</div>
									<div className="misc-button-row">
										<RandomiseButton clickHandler={this.onRandomiseButtonClick} />
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
			</div>
		);
	}
}
