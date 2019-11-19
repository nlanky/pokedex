import typeArr from './types';
import versionArr from './versions';
import versionGroupArr from './versionGroups';

const generatePokemonTypeEffectiveness = (typeOneDamageRelations, typeTwoDamageRelations, abilities) => {
	const typeEffectivenessObj = {};

	// Function to add missing types from object with normal effectiveness
	const addMissingNormalDamage = () => {
		for (let i = 0; i < typeArr.length; i++) {
			const type = typeArr[i];
			if (typeof typeEffectivenessObj[type] === 'undefined') typeEffectivenessObj[type] = 1;
		}
	};

	// TODO: Add text to type effectiveness display about abilities
	// Take into account any abilities
	const adjustForAbilities = () => {
		const typeKeys = Object.keys(typeEffectivenessObj);
		if (abilities.length > 1) return;
		abilities.forEach((ability) => {
			const abilityName = ability.name;
			if (abilityName === 'Wonder Guard') {
				typeKeys.forEach((type) => {
					if (typeEffectivenessObj[type] < 2) typeEffectivenessObj[type] = 0;
				});
			} else if (abilityName === 'Filter' || abilityName === 'Prism Armor' || abilityName === 'Solid Rock') {
				typeKeys.forEach((type) => {
					if (typeEffectivenessObj[type] >= 2) typeEffectivenessObj[type] *= 0.75;
				});
			} else if (abilityName === 'Flash Fire') {
				typeEffectivenessObj.fire = 0;
			} else if (abilityName === 'Fluffy') {
				typeEffectivenessObj.fire *= 2;
			} else if (abilityName === 'Heatproof' || abilityName === 'Water Bubble') {
				typeEffectivenessObj.fire *= 0.5;
			} else if (abilityName === 'Levitate') {
				typeEffectivenessObj.ground = 0;
			} else if (abilityName === 'Lightning Rod' || abilityName === 'Motor Drive' || abilityName === 'Volt Absorb') {
				typeEffectivenessObj.electric = 0;
			} else if (abilityName === 'Sap Sipper') {
				typeEffectivenessObj.grass = 0;
			} else if (abilityName === 'Storm Drain' || abilityName === 'Water Absorb') {
				typeEffectivenessObj.water = 0;
			} else if (abilityName === 'Thick Fat') {
				typeEffectivenessObj.fire *= 0.5;
				typeEffectivenessObj.ice *= 0.5;
			}
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
		return typeEffectivenessObj;
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
	return typeEffectivenessObj;
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

export {
	generatePokemonTypeEffectiveness,
	selectSecondaryDisplayFlavourText,
	selectAbilityFlavourText,
};
