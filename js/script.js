'use strict';

const droplistDefault = document.querySelector(`.dropdown-lists__list--default`);
const  droplistSelect = document.querySelector(`.dropdown-lists__list--select`);
const dropdownlistAutocomplete = document.querySelector(`.dropdown-lists__list--autocomplete`);

class CitiesList {
	constructor() {
		this.progData = JSON.parse(JSON.stringify(data));
	}
	start() {
		document.getElementById(`select-cities`).addEventListener(`focus`, () => {
			if (!droplistSelect.classList.contains(`display-block`) &&
			!dropdownlistAutocomplete.classList.contains(`display-block`)) {
				droplistDefault.classList.add(`display-block`);
				droplistSelect.classList.remove(`display-block`);
			}
			this.formListDefault();
		});
		this.toggleDroplistSelect.call(this);
		document.getElementById(`select-cities`).addEventListener(`keyup`, event => {
			this.formDropdownlistAutocomplete.call(this, event);
		});
		this.nameToInput.call(this);
		this.clearInput.call(this);
	}
	clearInput() {
		document.querySelector(`.close-button`).addEventListener(`click`, () => {
			document.getElementById(`select-cities`).value = ``;
			droplistDefault.classList.remove(`display-block`);
			droplistSelect.classList.remove(`display-block`);
			dropdownlistAutocomplete.classList.remove(`display-block`);
			this.handleLinkButton(false);
		});
	}
	handleLinkButton(active, link) {
		if (!active) {
			document.querySelector(`.button`).setAttribute(`href`, ``);
			document.querySelector(`.button`).classList.add(`no-link`);
		} else {
			document.querySelector(`.button`).setAttribute(`href`, link);
			document.querySelector(`.button`).classList.remove(`no-link`);
		}
	}
	nameToInput() {
		document.querySelector(`.dropdown-lists`).addEventListener(`click`, event => {
			let targetValue = ``;
			if (event.target.closest(`.dropdown-lists__line`) || event.target.closest(`.dropdown-lists__total-line`)) {
				if (event.target.closest(`.dropdown-lists__line`)) {
					const target = event.target.closest(`.dropdown-lists__line`);
					targetValue = target.querySelector(`.dropdown-lists__city`).textContent;
					let link = ``;
					this.progData[`RU`].find(country => {
						const selectedCity = country.cities.find(city => city.name === targetValue);
						if (selectedCity) {
							link = selectedCity.link;
							return;
						}
					});
					this.handleLinkButton(true, link);

				} else if (event.target.closest(`.dropdown-lists__total-line`)) {
					const target = event.target.closest(`.dropdown-lists__total-line`);
					targetValue = target.querySelector(`.dropdown-lists__country`).textContent;
				}

				document.getElementById(`select-cities`).value = targetValue;
				document.querySelector(`.close-button`).classList.add(`display-block`);
			}

		});
	}
	toggleDroplistSelect() {
		document.querySelector(`.dropdown-lists`).addEventListener(`click`, event => {
			const target = event.target.closest(`.dropdown-lists__total-line`);
			if (target) {
				if (droplistSelect.classList.contains(`display-block`)) {
					droplistDefault.classList.toggle(`display-block`);
					droplistSelect.classList.toggle(`display-block`);
				} else {
					const cityTarget = event.target.closest(`.dropdown-lists__country`);
					const countryName = cityTarget.textContent;
					this.formDroplistSelect(countryName);
				}
			}
		});
	}
	formListDefault() {
		droplistDefault.querySelector(`.dropdown-lists__col`).innerHTML = ``;
		const citiesData = JSON.parse(JSON.stringify(this.progData[`RU`]));
		const countryBlock = document.createElement(`div`);
		citiesData.forEach(country => {
			countryBlock.classList.add(`dropdown-lists__countryBlock`);
			countryBlock.innerHTML = `
			<div class="dropdown-lists__total-line">
				<div class="dropdown-lists__country">${country.country}</div>
				<div class="dropdown-lists__count">${country.count}</div>
			</div>
			`;
			const topCities = country.cities.sort((a, b) => +b.count - +a.count).splice(0, 3);
			topCities.forEach(city => {
				countryBlock.insertAdjacentHTML(`beforeend`, `
					<div class="dropdown-lists__line">
						<div class="dropdown-lists__city">${city.name}</div>
						<div class="dropdown-lists__count">${city.count}</div>
					</div>
			`);
			});
			droplistDefault.querySelector(`.dropdown-lists__col`).append(countryBlock.cloneNode(true));
		});
	}
	formDroplistSelect(countryName) {
		const selectedCountry = this.progData[`RU`].find(elem => elem.country === countryName);
		droplistDefault.classList.toggle(`display-block`);
		droplistSelect.classList.toggle(`display-block`);
		droplistSelect.querySelector(`.dropdown-lists__col`).innerHTML = ``;
		const countryBlock = document.createElement(`div`);
		countryBlock.classList.add(`dropdown-lists__countryBlock`);
		countryBlock.innerHTML = `
			<div class="dropdown-lists__total-line">
				<div class="dropdown-lists__country">${selectedCountry.country}</div>
				<div class="dropdown-lists__count">${selectedCountry.count}</div>
			</div>
		`;
		selectedCountry.cities.forEach(city => {
			countryBlock.insertAdjacentHTML(`beforeend`, `
				<div class="dropdown-lists__line">
					<div class="dropdown-lists__city">${city.name}</div>
					<div class="dropdown-lists__count">${city.count}</div>
				</div>
			`);
		});
		droplistSelect.querySelector(`.dropdown-lists__col`).append(countryBlock.cloneNode(true));
	}
	formDropdownlistAutocomplete(event) {
		const value = event.target.value;
		if (value !== ``) {
			droplistDefault.classList.remove(`display-block`);
			droplistSelect.classList.remove(`display-block`);
			dropdownlistAutocomplete.classList.add(`display-block`);
			const reg = new RegExp(value, `i`);
			let suitableCities = [];
			this.progData[`RU`].forEach(country => {
				suitableCities = [...suitableCities, ...country.cities.filter(city => reg.test(city.name))];
			});
			dropdownlistAutocomplete.querySelector(`.dropdown-lists__col`).innerHTML = ``;
			if (suitableCities.length !== 0) {
				const countryBlock = document.createElement(`div`);
				countryBlock.classList.add(`dropdown-lists__countryBlock`);
				suitableCities.forEach(city => {
					countryBlock.insertAdjacentHTML(`beforeend`, `
						<div class="dropdown-lists__line">
							<div class="dropdown-lists__city">${city.name}</div>
							<div class="dropdown-lists__count">${city.count}</div>
						</div>
					`);
				});
				dropdownlistAutocomplete.querySelector(`.dropdown-lists__col`).append(countryBlock.cloneNode(true));
			} else {
				const response = document.createElement(`div`);
				response.classList.add(`dropdown-lists__line`);
				response.textContent = `Ничего не найдено`;
				dropdownlistAutocomplete.querySelector(`.dropdown-lists__col`).append(response);
			}
		} else {
			droplistDefault.classList.add(`display-block`);
			droplistSelect.classList.remove(`display-block`);
			dropdownlistAutocomplete.classList.remove(`display-block`);
			this.handleLinkButton(false);
		}
	}
}

const prog = new CitiesList();
prog.start();
