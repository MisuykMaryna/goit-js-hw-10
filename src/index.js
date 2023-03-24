import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries, fetchApiSearchQuery } from './fetchCountries'

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector("#search-box"),
    countryList: document.querySelector(".country-list"),
    countryInfo: document.querySelector(".country-info"),
}

refs.input.addEventListener("input", debounce(selectionCountry), DEBOUNCE_DELAY);

function selectionCountry(e) {
  e.preventDefault();
  const inputValue = e.target.value.trim();
  if (!inputValue) {
    clearAll();
    return;
  }


fetchCountries(inputValue)
 .then(country => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (country.length >= 2 && country.length <= 10) {
        clearAll();
        createCountryList(country);
      } else {
        clearAll();
        createCountryInfo(country);
      }
    })
    .catch(() => {
      clearAll();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
function createCountryList(country) {
  const markup = country
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="flag" />
        <p class="country-list__text">${name.official}</p>
      </li>`;
    })
    .join('');
  return refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function createCountryInfo(country) {
  const markup = country
    .map(({ name, capital, population, flags, languages }) => {
      return `
  <div class="country__flag">
    <img class="country__img" src="${flags.svg}" alt="flag">
    <p class="country__name">${name.official}</p>
  </div>
  <ul class="country__info">
      <li class="country__item"> <b>Capital</b>:
    <span class="country__span">${capital}</span>
      </li>
      <li class="country__item"> <b>Population</b>:
    <span class="country__span">${population}</span>
      </li>
      <li class="country__item"> <b>Languages</b>:
    <span class="country__span">${Object.values(languages).join(', ')}</span>
      </li>
  </ul>`;
    })
    .join('');

  return refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function clearAll() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
};

