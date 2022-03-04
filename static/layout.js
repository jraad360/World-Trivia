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
