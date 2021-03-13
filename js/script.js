'use strict';

const droplistDefault = document.querySelector(`.dropdown-lists__list--default`);
const  droplistSelect = document.querySelector(`.dropdown-lists__list--select`);
const dropdownlistAutocomplete = document.querySelector(`.dropdown-lists__list--autocomplete`);

class CitiesList {
	constructor() {
	}
	start() {
		if (!this.handleLangCookie()) {
			document.querySelector(`.lds-spinner`).remove();
			return;
		}
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
	getCookie(name) {
		let matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}
	handleLangCookie() {
		if (this.getCookie(`lang`)) {
			return true;
		} else {
			const lang = this.selectLanguage.call(this);
			if (lang) {
				document.cookie = `lang=${lang}`;
				localStorage.removeItem('data');
				return true;
			} else {
				return false;
			}
		}
	}
	selectLanguage() {
		let language;
		const reg = new RegExp(`(^RU$)|(^EN$)|(^DE$)`);
		do {
			language = prompt(`Select your language (RU, EN, DE)`);
			if (language === null) {
				return false;
			}
		} while (!reg.test(language));
		return language;
	}
	getData() {
		if (localStorage.getItem('data')) {
			document.querySelector(`.input-cities`).classList.remove(`opacity`);
			document.querySelector(`.lds-spinner`).remove();
		} else {
			fetch(`http://localhost:3000/${this.getCookie(`lang`)}`)
				.then(response => {
					if (response.status !== 200) {
						document.querySelector(`.lds-spinner`).innerHTML = `Возникла ошибка при получении данных`;
						document.querySelector(`.lds-spinner`).classList.remove(`lds-spinner`);
						throw new Error(`Возникла ошибка при получении данных`);
					} else {
						return response.json();
					}
				})
				.then(data => {
					const lang = this.getCookie(`lang`);
					// Ставим страну первой в списке в зависимости от выбранного языка
					const sortData = [];
					data.forEach((country, index) => {
						if (lang === `RU`) {
							if (index !== 0) {
								sortData.push(country);
							} else {
								sortData.unshift(country);
							}
						} else if (lang === `DE`) {
							if (index !== 1) {
								sortData.push(country);
							} else {
								sortData.unshift(country);
							}
						} else {
							if (index !== 2) {
								sortData.push(country);
							} else {
								sortData.unshift(country);
							}
						}
					});
					localStorage.setItem('data', JSON.stringify(sortData));
					document.querySelector(`.input-cities`).classList.remove(`opacity`);
					document.querySelector(`.lds-spinner`).remove();
				})
				.catch(error => {
					console.log(error);
				});
		}
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
			document.querySelector(`.label`).classList.remove(`opacity`);
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
				document.querySelector(`.label`).classList.add(`opacity`);
				if (event.target.closest(`.dropdown-lists__line`)) {
					const target = event.target.closest(`.dropdown-lists__line`);
					targetValue = target.querySelector(`.dropdown-lists__city`).textContent;
					let link = ``;
					JSON.parse(localStorage.getItem('data')).find(country => {
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
					this.handleLinkButton(false);
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
					const countryName = target.querySelector(`.dropdown-lists__country`).textContent;
					this.formDroplistSelect(countryName);
				}
			}
		});
	}
	formListDefault() {
		droplistDefault.querySelector(`.dropdown-lists__col`).innerHTML = ``;
		const citiesData = JSON.parse(localStorage.getItem('data'));
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
		const selectedCountry = JSON.parse(localStorage.getItem('data')).find(elem => elem.country === countryName);
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
			document.querySelector(`.label`).classList.add(`opacity`);
			const reg = new RegExp(value, `i`);
			let suitableCities = [];
			JSON.parse(localStorage.getItem('data')).forEach(country => {
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
			document.querySelector(`.label`).classList.remove(`opacity`);
			droplistDefault.classList.add(`display-block`);
			droplistSelect.classList.remove(`display-block`);
			dropdownlistAutocomplete.classList.remove(`display-block`);
			this.handleLinkButton(false);
		}
	}
}

const prog = new CitiesList();
prog.start();
