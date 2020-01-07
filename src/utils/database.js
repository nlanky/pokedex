export default class Database {
	constructor() {
		this.db = null;
	}

	start() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open('pokemon', 2);

			request.onerror = (event) => {
				const errorMsg = `Database start error: ${event.target.errorCode}`;
				console.error(errorMsg);
				reject(errorMsg);
			};

			request.onsuccess = (event) => {
				this.db = event.target.result;
				this.db.onerror = (dbEvent) => {
					console.error(`Database error: ${dbEvent.target.errorCode}`);
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
			};
		});
	}

	createTransaction(store, data) {
		return new Promise((resolve, reject) => {
			if (!this.db) reject('Database not initialised');

			const request = this.db.transaction([store], 'readwrite').objectStore(store).add(data);
			request.onsuccess = (event) => {
				resolve(event.target.result); // Returns key of added data
			};

			request.onerror = (event) => {
				reject(`Create transaction error: ${event.target.errorCode}`);
			};
		});
	}

	readTransaction(store, key) {
		return new Promise((resolve, reject) => {
			if (!this.db) reject('Database not initialised');

			// Transaction mode defaults to 'readonly'
			const request = this.db.transaction(store).objectStore(store).get(key);
			request.onsuccess = (event) => {
				resolve(event.target.result); // Returns data for provided key
			};

			request.onerror = (event) => {
				reject(`Read transaction error: ${event.target.errorCode}`);
			};
		});
	}

	updateTransaction(store, key, data) {
		return new Promise((resolve, reject) => {
			if (!this.db) reject('Database not initialised');

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
					reject(`Update transaction error: ${updateEvent.target.errorCode}`);
				};
			};

			readRequest.onerror = (event) => {
				reject(`Update transaction error: ${event.target.errorCode}`);
			};
		});
	}

	deleteTransaction(store, key) {
		return Promise((resolve, reject) => {
			if (!this.db) reject('Database not initialised');

			const request = this.db.transaction([store], 'readwrite').objectStore(store).delete(key);
			request.onsuccess = (event) => {
				resolve(event.target.result);
			};

			request.onerror = (event) => {
				reject(`Delete transaction error: ${event.target.errorCode}`);
			};
		});
	}
}
