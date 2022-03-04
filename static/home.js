$(document).ready(() => {
  loadCountries(data.countries);
});

function loadCountries(countriesObject) {
  $("#countries-list").empty();

  Object.entries(countriesObject).forEach(([id, country]) => {
    console.log('hey')
    addCountryToView(id, country)
  });

  if (Object.entries(countriesObject).length == 0) {
    setSearchResultsText(`No results found for '${data.search}'`);
  }
}

function addCountryToView(id, country) {
  const card = createHomeCountryCard(id, country)
  $("#countries-list").append(card);
}

function createHomeCountryCard(id, country) {
  const name = country.name;
  const capital = country.capital;
  const flagPath = country.flag;
  const countryLink = `/countries/${id}`;

  const html = `
    <div class="col-md-4 home-column">
      <div class="home-country-card">
        <a href="${countryLink}">
          <div class="home-card-content">
            <div class="col-md-12 home-country-card-item">
              <img class="home-country-card-flag" src="${flagPath}">
            </div>
            <div class="col-md-12 home-country-card-item">
              <div class="country-card-title">${name}</div>
              <div class="country-card-subtitle">☆ ${capital}</div>
            </div>
          </div>
        </a>
      </div>
    </div>
  `;

  return $(html);
}
