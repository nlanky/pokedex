import React from 'react';
import PropTypes from 'prop-types';
import '../../../../styles/app.scss';

export default class Sprite extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
		};

		// Binding methods
		this.onLoad = this.onLoad.bind(this);
	}

	onLoad() {
		this.setState({
			loaded: true,
		});
	}

	render() {
		const {
			spriteUrl,
			activeSprite,
			altText,
		} = this.props;

		const {
			loaded,
		} = this.state;

		if (!activeSprite) return null;

		return (
			<img
				alt={altText}
				src={spriteUrl}
				onLoad={this.onLoad}
				style={{
					opacity: loaded ? 1 : 0,
				}}
			/>
		);
	}
}

Sprite.propTypes = {
	spriteUrl: PropTypes.string.isRequired,
	activeSprite: PropTypes.bool,
	altText: PropTypes.string,
};

Sprite.defaultProps = {
	activeSprite: true,
	altText: 'Pokemon sprite',
};
