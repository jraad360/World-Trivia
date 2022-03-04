$(document).ready(() => {
  $('#country-search-form').submit(() => {
    if ($('#country-search-input').val().trim().length == 0) {
      $('#country-search-input').val('');
      $('#country-search-input').focus();
      return false;
    }
    return true;
  });
});

function createCountryCard(id, country) {
  const name = country.name;
  const capital = country.capital;
  const flagPath = country.flag;
  const description = country.description;
  const countryLink = `/countries/${id}`;

  const html = `
    <a href="${countryLink}">
      <div id="country-${id}" class="country-card">
        <div class="col-md-2 country-card-item">
          <img class="list-view-flag-image" src="${flagPath}">
        </div>
        <div class="col-md-2 country-card-item">
          <div class="country-card-title">${name}</div>
          <div class="country-card-subtitle">☆ ${capital}</div>
        </div>
        <div class="col-md-8 country-card-item country-card-description">
          ${description}
        </div>
      </div>
    </a>
  `;

  return $(html);
}
