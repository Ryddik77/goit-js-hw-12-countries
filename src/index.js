import './sass/main.scss';
import * as _ from 'lodash';
import fetchCountries from './js/fetchCountries';
import { alert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/confirm/dist/PNotifyConfirm.css';

const autocomplete = document.querySelector('#js-country-autocomplete');
const countries = document.querySelector('#js-countries');
const country = document.querySelector('#js-country');

const onInput = _.debounce(value => {
  if (!value.trim()) {
    hideCountry();
    clearCountries();
    return;
  }

  fetchCountries(value).then(data => {
    if (data.length > 10) {
      alert({
        text: 'Too many matches found. Please enter a more specific query!',
        type: 'error',
        animation: 'fade',
        hide: true,
        delay: 3000,
      });
      return;
    }

    if (data.length > 1) {
      hideCountry();
      renderingCountries(data);
      return;
    }

    if (data.length === 1) {
      clearCountries();
      renderingCountry(data[0]);
    }
  });
}, 500);

autocomplete.addEventListener('input', event => onInput(event.target.value));

function hideCountry() {
  country.classList.add('hide');
}

function visibleCountry() {
  country.classList.remove('hide');
}

function clearCountries() {
  countries.innerHTML = '';
}

function renderingCountry(country) {
  document.querySelector('#js-country-name').textContent = country.name;
  document.querySelector('#js-capital').textContent = country.capital;
  document.querySelector('#js-population').textContent = country.population;
  document.querySelector('#js-languages').innerHTML = country.languages
    .map(l => `<li>${l.name}</li>`)
    .join('');
  document.querySelector('#js-flag').setAttribute('src', country.flag);
  visibleCountry();
}

function renderingCountries(dataCountries) {
  countries.innerHTML = dataCountries.map(c => `<li>${c.name}</li>`).join('');
}
