import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

// Type-colour reference object
const typeColour = {
	normal: '#A8A878',
	fighting: '#C03028',
	flying: '#A890F0',
	poison: '#A040A0',
	ground: '#E0C068',
	rock: '#B8A038',
	bug: '#A8B820',
	ghost: '#705898',
	steel: '#B8B8D0',
	fire: '#F08030',
	water: '#6890F0',
	grass: '#78C850',
	electric: '#F8D030',
	psychic: '#F85888',
	ice: '#98D8D8',
	dragon: '#7038F8',
	dark: '#705848',
	fairy: '#EE99AC',
};

const TypeDisplay = (props) => {
	const {
		type,
	} = props;

	// Use the reference object to get the correct type background
	const background = typeColour[type];

	return (
		<div className="type-display" style={{ backgroundColor: background }}>
			{type[0].toUpperCase() + type.slice(1)}
		</div>
	);
};

TypeDisplay.propTypes = {
	type: PropTypes.string.isRequired,
};

export default TypeDisplay;
