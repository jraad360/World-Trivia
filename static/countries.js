$(document).ready(() => {
  loadCountries(data.countries);
});

function loadCountries(countriesObject) {
  $("#countries-list").empty();

  // console.log(countriesObject.keys())

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
    console.log('hey')
    addCountryToView(id, countriesObject[id])
  });

  if (!data.search || data.search == '') {
    setSearchResultsText('Showing all countries');
  }
  if (Object.entries(countriesObject).length == 0) {
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