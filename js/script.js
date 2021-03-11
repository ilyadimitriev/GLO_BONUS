'use strict';

const droplistDefault = document.querySelector(`.dropdown-lists__list--default`);
const  droplistSelect = document.querySelector(`.dropdown-lists__list--select`);
const dropdownlistAutocomplete = document.querySelector(`.dropdown-lists__list--autocomplete`);

class CitiesList {
	constructor() {
		this.progData = [];
	}
	start() {
		this.getData.call(this);
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
	getData() {
		fetch(`http://localhost:3000/RU`)
			.then(response => {
				if (response.status !== 200) {
					throw new Error(`Возникла ошибка при отправки данных`);
				} else {
					return response.json();
				}
			})
			.then(data => {
				this.progData = JSON.parse(JSON.stringify(data));
				document.querySelector(`.input-cities`).classList.remove(`opacity`);
				document.querySelector(`.lds-spinner`).remove();
			})
			.catch(error => {
				console.log(error);
			});
	}
	// Анимация показа городов
	animateShowCities() {
		const scroll = document.querySelector(`.dropdown`).scrollTop;
		document.querySelector(`.dropdown-lists`).style.cssText = `
			display: block;
			overflow-x: hidden;
		`;
		droplistDefault.classList.add(`display-block`);
		droplistSelect.classList.add(`display-block`);
		droplistSelect.style.cssText = `
			position: absolute;
			top: ${scroll}px;
			left: -100%;
			heigth: 100%;
			width: 100%;
		`;
		droplistDefault.style.marginLeft = `0%`;

		let animationId,
			count = 0;
		const step = 5;
		function animate() {
			animation();
			start();
		}
		function start() {
			// Пока не удалим анимацию, она будет стартовать
			if (animationId !== false) {
				animationId = requestAnimationFrame(animate);
			}
		}
		start();
		function animation() {
			count += step;
			if (count <= 100) {
				droplistDefault.style.marginLeft = (+droplistDefault.style.marginLeft.replace(/%/, ``) + step) + `%`;
				droplistSelect.style.left = (+droplistSelect.style.left.replace(/%/, ``) + step) + `%`;
			} else {
				droplistDefault.classList.remove(`display-block`);
				document.querySelector(`.dropdown-lists`).style.cssText = ``;
				droplistSelect.style.cssText = ``;
				droplistDefault.style.marginLeft = ``;
				animationId = false;
			}
		}
	}
	// Анимация скрытия городов
	animateHideCities() {
		document.querySelector(`.dropdown-lists`).style.cssText = `
			display: block;
			overflow-x: hidden;
		`;
		droplistDefault.classList.add(`display-block`);
		droplistSelect.classList.add(`display-block`);
		droplistSelect.style.cssText = `
			position: absolute;
			top: 0;
			left: 0%;
			heigth: 100%;
			width: 100%;
		`;
		droplistDefault.style.marginLeft = `100%`;

		let animationId,
			count = 0;
		const step = 5;
		function animate() {
			animation();
			start();
		}
		function start() {
			// Пока не удалим анимацию, она будет стартовать
			if (animationId !== false) {
				animationId = requestAnimationFrame(animate);
			}
		}
		start();
		function animation() {
			count += step;
			if (count <= 100) {
				droplistDefault.style.marginLeft = (+droplistDefault.style.marginLeft.replace(/%/, ``) - step) + `%`;
				droplistSelect.style.left = (+droplistSelect.style.left.replace(/%/, ``) - step) + `%`;
			} else {
				droplistSelect.classList.remove(`display-block`);
				document.querySelector(`.dropdown-lists`).style.cssText = ``;
				droplistSelect.style.cssText = ``;
				droplistDefault.style.marginLeft = ``;
				animationId = false;
			}
		}
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
					this.progData.find(country => {
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
					this.animateHideCities();
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
		const citiesData = JSON.parse(JSON.stringify(this.progData));
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
		const selectedCountry = this.progData.find(elem => elem.country === countryName);
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
		this.animateShowCities();
	}
	formDropdownlistAutocomplete(event) {
		const value = event.target.value;
		if (value !== ``) {
			droplistDefault.classList.remove(`display-block`);
			droplistSelect.classList.remove(`display-block`);
			dropdownlistAutocomplete.classList.add(`display-block`);
			const reg = new RegExp(value, `i`);
			let suitableCities = [];
			const handleInput = (data) => {
				data.forEach(country => {
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
			};
			fetch(`http://localhost:3000/RU`)
				.then(response => {
					if (response.status !== 200) {
						throw new Error(`Возникла ошибка при отправки данных`);
					} else {
						return response.json();
					}
				})
				.then(data => handleInput(data))
				.catch(error => {
					console.log(error);
				});
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
