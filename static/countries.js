$(document).ready(() => {
  loadCountries(data.countries);
});

function loadCountries(countriesObject) {
  $("#countries-list").empty();

  const orderedIds = Object.keys(countriesObject).sort((a, b) => {
    if (countriesObject[a].name > countriesObject[b].name) {
      return 1;
    }
    if (countriesObject[a].name < countriesObject[b].name) {
      return -1;
    }
    return 0;
  });

  orderedIds.forEach((id) => {
    addCountryToView(id, countriesObject[id])
  });

  if (!searchWasMade()) {
    setSearchResultsText('Showing all countries');
  }
  if (Object.entries(countriesObject).length == 0) {
    highlightMatches();
    setSearchResultsText(`No results found for '${data.search}'`);
  }
}

function addCountryToView(id, country) {
  const card = createCountryCard(id, country)
  $("#countries-list").append(card);
}

function setSearchResultsText(text) {
  $('#search-results-title').text(text)
}

function highlightMatches() {
  $(".country-card").each(() => {
    console.log($(this));
  });
}

function createCountryCard(id, country) {
  let name = country.name;
  let capital = country.capital;
  let officialName = country.officialName;
  let continent = country.continent;
  const flagPath = country.flag;
  const description = country.description;
  const countryLink = `/countries/${id}`;

  if(searchWasMade()) {
    console.log(name);
    const searchTerm = data.search;

    const re = new RegExp(searchTerm, "ig");
    name = name.replace(re, (match) => `<mark>${match}</mark>`);
    capital = capital.replace(re, (match) => `<mark>${match}</mark>`);
    officialName = officialName.replace(re, (match) => `<mark>${match}</mark>`);
    continent = continent.replace(re, (match) => `<mark>${match}</mark>`);
  }
  const html = `
    <a href="${countryLink}">
      <div id="country-${id}" class="country-card">
        <div class="col-md-2 country-card-item">
          <img alt="flag of ${country.name}" class="list-view-flag-image" src="${flagPath}">
        </div>
        <div class="col-md-4 country-card-item">
          <div class="country-card-title">${name}</div>
          <div class="country-card-subtitle">${officialName}, ${continent}</div>
          <div class="country-card-subtitle">☆ ${capital}</div>
        </div>
        <div class="col-md-6 country-card-item country-card-description">
          ${description}
        </div>
      </div>
    </a>
  `;

  return $(html);
}

function searchWasMade() {
  return data.search && data.search != '';
}
