import React from 'react';

import axios from 'axios';
import {Wave} from 'better-react-spinkit';
import {FaChevronLeft, FaChevronRight, FaChevronUp, FaChevronDown} from 'react-icons/fa';

import convertStringToSentenceCase from '../../utils/common';

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

var spriteRefObj = {
	0: 'front_default',
	1: 'back_default',
	2: 'front_shiny',
	3: 'back_shiny',
};

export default class Pokedex extends React.Component {
	state = {
		pokemonApiUrl: 'https://pokeapi.co/api/v2/pokemon/',
		pokemonSpeciesUrl: 'https://pokeapi.co/api/v2/pokemon-species/',
		cryUrl: '',
		pokedexNumber: 1,
		pokemonData: [],
		pokemonSpeciesData: [],
		dataReady: false,
		activeSprite: 0,
		language: 'en',
		version: 'x',
		activeSecondaryDisplay: 'flavourText',
		cache: {},
	};

	componentDidMount() {
		this.getData();
	}

	async getData(id) {
		const {
			pokemonApiUrl,
			pokemonSpeciesUrl,
			pokedexNumber,
			cache,
		} = this.state;

		var pokemonData = [];
		var pokemonSpeciesData = [];
		var pokedexNumberToGet = id ? id : pokedexNumber;

		if (cache[pokedexNumberToGet]) {
			const cacheEntry = cache[pokedexNumberToGet];
			pokemonData = cacheEntry.pokemonData;
			pokemonSpeciesData = cacheEntry.pokemonSpeciesData;
		} else {
			const pokemonDataPromise = axios.get(pokemonApiUrl + pokedexNumberToGet);
			const pokemonSpeciesPromise = axios.get(pokemonSpeciesUrl + pokedexNumberToGet);
			await Promise.all([pokemonDataPromise, pokemonSpeciesPromise]).then((res) => {
				const data = res[0].data;
				const speciesData = res[1].data;
				pokemonData = data;
				pokemonSpeciesData = speciesData;
				cache[pokedexNumberToGet] = {
					pokemonData: data,
					pokemonSpeciesData: speciesData,
				};
			});
		}

		this.setState({
			pokemonData,
			pokemonSpeciesData,
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
		if (nextPokedexNumber > 807)
			return;

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
		if (prevPokedexNumber < 1)
			return;

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

	render() {
		const {
			pokedexNumber,
			pokemonData,
			pokemonSpeciesData,
			dataReady,
			activeSprite,
			language,
			version,
			activeSecondaryDisplay,
		} = this.state;

		if (!dataReady)
			return <Wave />;

		console.log(pokemonData);
		console.log(pokemonSpeciesData);

		// Types
		// Ensure types are in the correct order (primary first)
		const typeArr = pokemonData.types.sort((a, b) => {return a.slot - b.slot});
		const typeOne = typeArr[0].type.name;
		const typeTwo = typeArr[1] ? typeArr[1].type.name : null;

		// Sprites
		const spriteObj = pokemonData.sprites;

		// Flavour text (description)
		// Should return 1 object from flavor_text_entries array once filtered
		const flavourTextObj = pokemonSpeciesData.flavor_text_entries.filter(item => item.language.name === language && item.version.name === version)[0];

		// Sprite display
		const displayLeftNumber = pokedexNumber - 1;
		const displayRightNumber = pokedexNumber + 1;
		const displayLeftCycle = displayLeftNumber !== 0;
		const displayRightCycle = displayRightNumber !== 807; // End of Alola Pokedex
		const displayTopCycle = (activeSprite - 1) >= 0;
		const displayBottomCycle = (activeSprite + 1) <= 3;

		// Statistics
		const statsArr = pokemonData.stats;
		var statistics = [];
		for (let i=0; i<statsArr.length; i++)
		{
			const stat = statsArr[i];
			statistics.push({
				name: convertStringToSentenceCase(stat.stat.name),
				value: stat.base_stat,
			});
		}

		// Height & Weight
		const heightWeightObj = {
			height: pokemonData.height,
			weight: pokemonData.weight,
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
									<NumberDisplay number={pokedexNumber} name={pokemonData.name} />
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
						<SecondaryDisplay
							activeDisplay={activeSecondaryDisplay}
							flavourText={flavourTextObj.flavor_text}
							statistics={statistics}
							heightWeight={heightWeightObj}
						/>
						<div className="grid-button-container">
							<GridButton clickHandler={this.onGridButtonClick} screen="flavourText" />
							<GridButton clickHandler={this.onGridButtonClick} screen="statistics" />
							<GridButton clickHandler={this.onGridButtonClick} screen="heightWeight" />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
							<GridButton clickHandler={this.onGridButtonClick} />
						</div>
						<div className="misc-button-container">
							<div className="misc-button-left-col">
								<div className="white-grid-button" />
								<div className="white-grid-button" />
							</div>
							<div className="misc-button-right-col">
								<div className="misc-button-row">
									<SlimButton />
									<SlimButton noMargin />
								</div>
								<div className="misc-button-row">
									<ConfirmButton />
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
