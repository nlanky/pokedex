import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const NumberDisplay = (props) => {
	const {
		pokemonInput,
		onPokemonInput,
		onPokemonInputBlur,
		onPokemonInputClick,
	} = props;

	return (
		<div className="number-display-wrapper">
			<input
				className="number-display"
				type="text"
				value={pokemonInput}
				onInput={onPokemonInput}
				onChange={onPokemonInput}
				onBlur={onPokemonInputBlur}
				onClick={onPokemonInputClick}
			/>
		</div>
	);
};

NumberDisplay.propTypes = {
	pokemonInput: PropTypes.string.isRequired,
	onPokemonInput: PropTypes.func.isRequired,
	onPokemonInputBlur: PropTypes.func.isRequired,
	onPokemonInputClick: PropTypes.func.isRequired,
};

export default NumberDisplay;
