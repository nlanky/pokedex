import typeArr from './types';
import versionArr from './versions';
import versionGroupArr from './versionGroups';

const generatePokemonTypeEffectiveness = (typeOneDamageRelations, typeTwoDamageRelations, abilities) => {
	const typeEffectivenessObj = {};
	const typeEffectivenessArr = [];

	// Function to add missing types from object with normal effectiveness
	const addMissingNormalDamage = () => {
		for (let i = 0; i < typeArr.length; i++) {
			const type = typeArr[i];
			if (typeof typeEffectivenessObj[type] === 'undefined') typeEffectivenessObj[type] = 1;
		}
	};

	// Take into account any abilities
	// If Pokemon has 1 ability, can apply changes to typeEffectivenessObj
	const adjustForAbilities = () => {
		const typeKeys = Object.keys(typeEffectivenessObj);
		const hasMultipleAbilities = abilities.length > 1;
		abilities.forEach((ability) => {
			const affectedTypeArr = [];
			const abilityName = ability.name;
			switch (abilityName) {
				case 'Wonder Guard':
					typeKeys.forEach((type) => {
						if (typeEffectivenessObj[type] < 2) {
							if (hasMultipleAbilities) affectedTypeArr.push(`${type.charAt(0).toUpperCase()}${type.slice(1)} (0x)`);
							else typeEffectivenessObj[type] = 0;
						}
					});
					break;
				case 'Filter':
				case 'Prism Armor':
				case 'Solid Rock':
					typeKeys.forEach((type) => {
						const multiplier = typeEffectivenessObj[type];
						if (multiplier >= 2) {
							if (hasMultipleAbilities) affectedTypeArr.push(`${type.charAt(0).toUpperCase()}${type.slice(1)} (${multiplier * 0.75}x)`);
							else typeEffectivenessObj[type] *= 0.75;
						}
					});
					break;
				case 'Flash Fire':
					if (hasMultipleAbilities) affectedTypeArr.push('Fire (0x)');
					else typeEffectivenessObj.fire = 0;
					break;
				case 'Fluffy':
					if (hasMultipleAbilities) affectedTypeArr.push(`Fire (${typeEffectivenessObj.fire * 2}x)`);
					else typeEffectivenessObj.fire *= 2;
					break;
				case 'Heatproof':
				case 'Water Bubble':
					if (hasMultipleAbilities) affectedTypeArr.push(`Fire (${typeEffectivenessObj.fire * 0.5}x)`);
					else typeEffectivenessObj.fire *= 0.5;
					break;
				case 'Levitate':
					if (hasMultipleAbilities) affectedTypeArr.push('Ground (0x)');
					else typeEffectivenessObj.ground = 0;
					break;
				case 'Lightning Rod':
				case 'Motor Drive':
				case 'Volt Absorb':
					if (hasMultipleAbilities) affectedTypeArr.push('Electric (0x)');
					else typeEffectivenessObj.electric = 0;
					break;
				case 'Sap Sipper':
					if (hasMultipleAbilities) affectedTypeArr.push('Grass (0x)');
					else typeEffectivenessObj.grass = 0;
					break;
				case 'Storm Drain':
				case 'Water Absorb':
					if (hasMultipleAbilities) affectedTypeArr.push('Water (0x)');
					else typeEffectivenessObj.water = 0;
					break;
				case 'Thick Fat':
					if (hasMultipleAbilities) {
						affectedTypeArr.push(`Fire (${typeEffectivenessObj.fire * 0.5}x)`);
						affectedTypeArr.push(`Ice (${typeEffectivenessObj.ice * 0.5}x)`);
					} else {
						typeEffectivenessObj.fire *= 0.5;
						typeEffectivenessObj.ice *= 0.5;
					}
					break;
				default:
					break;
			}

			// Only display ability text if Pokemon has one of above abilities
			const abilityText = `* If this Pokémon has ${abilityName}, the following type effectiveness multipliers apply: `;
			if (affectedTypeArr.length > 0)
				typeEffectivenessArr.push({
					type: 'ability',
					name: abilityName,
					description: `${abilityText}${affectedTypeArr.join(', ')}`,
				});
		});
	};

	// Convert typeEffectivenessObj into array for rendering
	const formatTypeEffectivenessArr = () => {
		Object.keys(typeEffectivenessObj).forEach((type) => {
			typeEffectivenessArr.push({
				type: 'type',
				name: type,
				multiplier: typeEffectivenessObj[type],
			});
		});
	};

	// Add all damage relations from type one
	typeOneDamageRelations.double_damage_from.forEach((val) => {
		typeEffectivenessObj[val.name] = 2;
	});

	typeOneDamageRelations.half_damage_from.forEach((val) => {
		typeEffectivenessObj[val.name] = 0.5;
	});

	typeOneDamageRelations.no_damage_from.forEach((val) => {
		typeEffectivenessObj[val.name] = 0;
	});

	// If there is only 1 type, set missing types to 1x effectiveness
	if (!typeTwoDamageRelations) {
		addMissingNormalDamage();
		adjustForAbilities();
		formatTypeEffectivenessArr();
		return typeEffectivenessArr;
	}

	// Double existing damage, otherwise set to 2x
	typeTwoDamageRelations.double_damage_from.forEach((val) => {
		const type = val.name;
		if (!typeEffectivenessObj[type]) {
			typeEffectivenessObj[type] = 2;
			return;
		}

		const typeDamage = typeEffectivenessObj[type];
		if (typeDamage === 2) {
			typeEffectivenessObj[type] = 4;
			return;
		}

		if (typeDamage === 1) {
			typeEffectivenessObj[type] = 2;
			return;
		}

		if (typeDamage !== 0) typeEffectivenessObj[type] = 1;
	});

	// Half existing damage, otherwise set to 0.5x
	typeTwoDamageRelations.half_damage_from.forEach((val) => {
		const type = val.name;
		if (!typeEffectivenessObj[type]) {
			typeEffectivenessObj[type] = 0.5;
			return;
		}

		const typeDamage = typeEffectivenessObj[type];
		if (typeDamage === 2) {
			typeEffectivenessObj[type] = 1;
			return;
		}

		if (typeDamage === 1) {
			typeEffectivenessObj[type] = 0.5;
			return;
		}

		if (typeDamage !== 0) typeEffectivenessObj[type] = 0.25;
	});

	// If type is immune, always overwrite to 0x
	typeTwoDamageRelations.no_damage_from.forEach((val) => {
		typeEffectivenessObj[val.name] = 0;
	});

	addMissingNormalDamage();
	adjustForAbilities();
	formatTypeEffectivenessArr();
	return typeEffectivenessArr;
};

const selectSecondaryDisplayFlavourText = (flavourTextArr, language) => {
	const filteredflavourTextArr = flavourTextArr.filter(item => item.language.name === language);
	const sortedFlavourTextArr = [];
	versionArr.forEach((value) => {
		let found = false;
		filteredflavourTextArr.filter((entry) => {
			if (!found && entry.version.name === value) {
				sortedFlavourTextArr.push(entry);
				found = true;
				return false;
			}

			return true;
		});
	});

	return sortedFlavourTextArr[0].flavor_text;
};

const selectAbilityFlavourText = (flavourTextArr, language) => {
	const filteredflavourTextArr = flavourTextArr.filter(item => item.language.name === language);
	const sortedFlavourTextArr = [];
	versionGroupArr.forEach((value) => {
		let found = false;
		filteredflavourTextArr.filter((entry) => {
			if (!found && entry.version_group.name === value) {
				sortedFlavourTextArr.push(entry);
				found = true;
				return false;
			}

			return true;
		});
	});

	return sortedFlavourTextArr[0].flavor_text;
};

const importPokemonCry = (pokedexNumber) => {
	if (!pokedexNumber)
		return import(
			/* webpackMode: "lazy" */ `../assets/pokemon-cries/unknown.ogg`
		);

	return import(
		/* webpackMode: "lazy" */ `../assets/pokemon-cries/${pokedexNumber}.ogg`
	);	
};

export {
	generatePokemonTypeEffectiveness,
	selectSecondaryDisplayFlavourText,
	selectAbilityFlavourText,
	importPokemonCry,
};
