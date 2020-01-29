import { jsonErrorReplacer } from './common';

export default class Database {
	constructor() {
		this.db = null;
	}

	start() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open('pokemon', 1);

			request.onerror = (event) => {
				console.error(`Database.start() -> Failed to start database. Error: ${JSON.stringify(event.target.error, jsonErrorReplacer)}`);
				reject(event.target.error);
			};

			request.onsuccess = (event) => {
				this.db = event.target.result;
				this.db.onerror = (dbEvent) => {
					console.error(`Database.onerror -> Caught error on database instance. Error: ${JSON.stringify(dbEvent.target.error, jsonErrorReplacer)}`);
				};
				resolve();
			};

			request.onupgradeneeded = (event) => {
				this.db = event.target.result;
				// Create required object stores if they don't exist
				if (!this.db.objectStoreNames.contains('pokemon')) {
					this.db.createObjectStore('pokemon', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('pokemon_species')) {
					this.db.createObjectStore('pokemon-species', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('stat')) {
					this.db.createObjectStore('stat', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('type')) {
					this.db.createObjectStore('type', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('ability')) {
					this.db.createObjectStore('ability', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('evolution_chain')) {
					this.db.createObjectStore('evolution-chain', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('location_area')) {
					this.db.createObjectStore('location-area', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('location')) {
					this.db.createObjectStore('location', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('version')) {
					this.db.createObjectStore('version', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('encounter-method')) {
					this.db.createObjectStore('encounter-method', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('encounter-condition-value')) {
					this.db.createObjectStore('encounter-condition-value', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('move')) {
					this.db.createObjectStore('move', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('egg-group')) {
					this.db.createObjectStore('egg-group', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('pokemon-form')) {
					this.db.createObjectStore('pokemon-form', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('evolution-trigger')) {
					this.db.createObjectStore('evolution-trigger', {
						keyPath: 'id',
					});
				}
				if (!this.db.objectStoreNames.contains('item')) {
					this.db.createObjectStore('item', {
						keyPath: 'id',
					});
				}
			};
		});
	}

	createTransaction(store, data) {
		return new Promise((resolve, reject) => {
			if (!this.db) reject(new Error('Database not initialised'));

			const request = this.db.transaction([store], 'readwrite').objectStore(store).add(data);
			request.onsuccess = (event) => {
				resolve(event.target.result); // Returns key of added data
			};

			request.onerror = (event) => {
				console.error(`Database.createTransaction(${data.id}, ${store}) -> Failed to write to database. Error: ${JSON.stringify(event.target.error, jsonErrorReplacer)}`);
				reject(event.target.error);
			};
		});
	}

	readTransaction(store, key) {
		return new Promise((resolve, reject) => {
			if (!this.db) reject(new Error('Database not initialised'));

			// Transaction mode defaults to 'readonly'
			const request = this.db.transaction(store).objectStore(store).get(key);
			request.onsuccess = (event) => {
				resolve(event.target.result); // Returns data for provided key
			};

			request.onerror = (event) => {
				console.error(`Database.readTransaction(${key}, ${store}) -> Failed to read from database. Error: ${JSON.stringify(event.target.error, jsonErrorReplacer)}`);
				reject(event.target.error);
			};
		});
	}

	updateTransaction(store, key, data) {
		return new Promise((resolve, reject) => {
			if (!this.db) reject(new Error('Database not initialised'));

			const objectStore = this.db.transaction(store, 'readwrite').objectStore(store);
			const readRequest = objectStore.get(key); // Mode defaults to 'readonly'
			readRequest.onsuccess = (event) => {
				// Retrieved current data for provided key
				const updatedData = event.target.result;

				// Now update data for key
				const newDataKeys = Object.keys(data);
				for (let i = 0; i < newDataKeys.length; i += 1) {
					const newDataKey = newDataKeys[i];
					updatedData[newDataKey] = data[newDataKey];
				}

				// Use updated data for put request
				const putRequest = objectStore.put(updatedData);
				putRequest.onsuccess = (updateEvent) => {
					resolve(updateEvent.target.result);
				};

				putRequest.onerror = (updateEvent) => {
					console.error(`Database.updateTransaction(${key}, ${store}) -> Failed to update database. Error: ${JSON.stringify(updateEvent.target.error, jsonErrorReplacer)}`);
					reject(updateEvent.target.error);
				};
			};

			readRequest.onerror = (event) => {
				console.error(`Database.updateTransaction(${key}, ${store}) -> Failed to read from database. Error: ${JSON.stringify(event.target.error, jsonErrorReplacer)}`);
				reject(event.target.error);
			};
		});
	}

	deleteTransaction(store, key) {
		return Promise((resolve, reject) => {
			if (!this.db) reject(new Error('Database not initialised'));

			const request = this.db.transaction([store], 'readwrite').objectStore(store).delete(key);
			request.onsuccess = (event) => {
				resolve(event.target.result);
			};

			request.onerror = (event) => {
				console.error(`Database.deleteTransaction(${key}, ${store}) -> Failed to delete from database. Error: ${JSON.stringify(event.target.error, jsonErrorReplacer)}`);
				reject(event.target.error);
			};
		});
	}
}
