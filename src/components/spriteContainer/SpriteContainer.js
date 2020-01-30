import React from 'react';
import PropTypes from 'prop-types';
import { Wave } from 'better-react-spinkit';
import {
	FaChevronLeft,
	FaChevronRight,
	FaChevronUp,
	FaChevronDown,
} from 'react-icons/fa';

import Sprite from './components/sprite';

import '../../styles/app.scss';

const SpriteContainer = (props) => {
	const {
		dataReady,
		prevSprite,
		nextPokemon,
		nextSprite,
		prevPokemon,
		displayTopCycle,
		displayRightCycle,
		displayBottomCycle,
		displayLeftCycle,
		displayLeftNumber,
		displayRightNumber,
		activeSprite,
		spriteArr,
	} = props;

	const onKeyDown = () => {};

	return (
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
							onClick={prevSprite}
							role="button"
							tabIndex={0}
							aria-label="Previous sprite"
							onKeyDown={onKeyDown}
						>
							{displayTopCycle
								&& <FaChevronUp color="#fff" />}
						</div>
					</div>
					<div className="sprite-middle">
						<div
							className="sprite-cycle left"
							onClick={prevPokemon}
							role="button"
							tabIndex={0}
							aria-label="Previous Pokemon"
							onKeyDown={onKeyDown}
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
							onClick={nextPokemon}
							role="button"
							tabIndex={0}
							aria-label="Next Pokemon"
							onKeyDown={onKeyDown}
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
							onClick={nextSprite}
							role="button"
							tabIndex={0}
							aria-label="Next sprite"
							onKeyDown={onKeyDown}
						>
							{displayBottomCycle
								&& <FaChevronDown color="#fff" />}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

SpriteContainer.propTypes = {
	dataReady: PropTypes.bool.isRequired,
	prevSprite: PropTypes.func.isRequired,
	nextPokemon: PropTypes.func.isRequired,
	nextSprite: PropTypes.func.isRequired,
	prevPokemon: PropTypes.func.isRequired,
	displayTopCycle: PropTypes.bool.isRequired,
	displayRightCycle: PropTypes.bool.isRequired,
	displayBottomCycle: PropTypes.bool.isRequired,
	displayLeftCycle: PropTypes.bool.isRequired,
	displayLeftNumber: PropTypes.number.isRequired,
	displayRightNumber: PropTypes.number.isRequired,
	activeSprite: PropTypes.number.isRequired,
	spriteArr: PropTypes.array.isRequired,
};

export default SpriteContainer;
