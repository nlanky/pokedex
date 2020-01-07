import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/app.scss';

const Sprite = (props) => {
	const {
		spriteUrl,
		activeSprite,
	} = props;

	if (!activeSprite) return null;

	return (
		<img alt="Pokemon sprite" src={spriteUrl} />
	);
};

Sprite.propTypes = {
	spriteUrl: PropTypes.string.isRequired,
	activeSprite: PropTypes.bool.isRequired,
};

export default Sprite;
