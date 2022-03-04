$(document).ready(() => {
  loadCountryInfo(data.country);
});

function loadCountryInfo(country) {
  $("#country-page-title").text(country.name);
  $("#country-description").text(country.description);
  $("#country-page-flag-image").attr('src', country.flag);
  $("#official-name").text(country.officialName);
  $("#capital").text(country.capital);
  $("#population").text(parseInt(country.population).toLocaleString("en-US"));
  $("#area").text(parseInt(country.area).toLocaleString("en-US"));
  $("#gdp").text(parseInt(country.gdp).toLocaleString("en-US"));
  $("#currency").text(country.currency);

  country.cities.forEach((city, index) => {
    const divToAddTo = index < 5 ? '#cities-list-left' : '#cities-list-right';
    const newDiv = $("<div>").text(`${index + 1}. ${city}`)
    $(divToAddTo).append(newDiv);
  });
}
