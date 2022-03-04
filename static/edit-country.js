$(document).ready(() => {
  
  setUpImageSelector();
  $("#save-button").click(() => {
    clearErrors();
    country = getCountryFromInputs();
    files = $("#image-input").prop('files');

    if (!validateInputs(country, files)) {
      return;
    }

    if (editingExistingCountry()) {
      let image = undefined;
      if (files.length > 0) image = files[0];
      updateCountry(data.country.id, country, image);
    } else {
      $("#edit-country-form").submit();
      // createCountry(country, files[0]);
    }
  });

  if (editingExistingCountry()) {
    loadCountryInfo(data.country);
    $("#cancel-button").click(() => {
      showDiscardChangesConfirmation();
    })
  } else {
    $("#cancel-button").remove();
    setUpCityInputs(Array(10).fill(''));
  }

  $("#country-page-title").focus();
});

function loadCountryInfo(country) {
  $("#country-page-title").val(country.name);
  $("#country-description").val(country.description);
  $("#country-description").each(function(index, elem){
    elem.style.height = elem.scrollHeight+'px'; 
  });
  $("#country-page-flag-image").attr('src', country.flag);
  $("#display-image").attr({'src': `${country.flag}`});
  $("#official-name").val(country.officialName);
  $("#capital").val(country.capital);
  $("#population").val(parseInt(country.population));
  $("#area").val(parseInt(country.area));
  $("#gdp").val(parseInt(country.gdp));
  $("#currency").val(country.currency);

  setUpCityInputs(country.cities);
}

function getCountryFromInputs() {
    const cities = [];
    for (let i = 0; i < 10; i++) {
      cities.push($(`#city-${i}`).val());
    }

  return {
    name: $("#country-page-title").val(),
    description: $("#country-description").val(),
    officialName: $("#official-name").val(),
    capital: $("#capital").val(),
    // TODO: upload image
    flag: editingExistingCountry() ? data.country.flag : '',
    population: parseInt($("#population").val()),
    area: parseInt($("#area").val()),
    currency: $("#currency").val(),
    gdp: parseInt($("#gdp").val()),
    cities: cities
  }
}

function setUpCityInputs(cities) {
  cities.forEach((city, index) => {
    const divToAddTo = index < 5 ? '#cities-list-left' : '#cities-list-right';
    const html = `
      <div>
        ${index + 1}. <input class="city-input" id="city-${index}" name="city-${index}" type="text" value="${city}">
      </div>
    `
    const newDiv = $(html)
    $(divToAddTo).append(newDiv);
  });
}

async function updateCountry(id, country, image) {
  try {
    const response = await $.ajax({
      type: "PUT",
      url: `/countries/${id}`,
      data: JSON.stringify({country: country}),
      contentType : "application/json"
    });
    
    if(image) await saveImage(response.country.id, image);
    location.replace(`/countries/${response.country.id}`);
    
  } catch(err) {
    console.log(err);
  }
}

async function createCountry(country, image) {
  try {
    const response = await $.ajax({
      type: "POST",
      url: `/countries`,
      data: JSON.stringify({country: country}),
      contentType : "application/json"
    });

    await saveImage(response.country.id, image);
    location.replace(`/countries/${response.country.id}`);
    
  } catch(err) {
    console.log(err);
  }
}

async function saveImage(id, image) {
  const fd = new FormData();
  fd.append('image', image);

  return $.ajax({
    type: "POST",
    url: `/countries/${id}/image`,
    data: fd,
    contentType: false,
    processData: false
  });
}

async function setUpImageSelector() {
  const imageInput = $("#image-input");
  imageInput.change(() => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const uploadedImage = reader.result;
      $("#display-image").attr({'src': `${uploadedImage}`});
  });
    reader.readAsDataURL($("#image-input").prop('files')[0]);
  });
}

function validateInputs(country, files) {
  let errors = [];
  const inputsThatCantBeEmpty = ["#country-page-title", "#country-description", "#official-name", "#capital", "#population", "#area", "#currency", "#gdp"];
  const integerInputs = [ "#population", "#area", "#gdp"];

  inputsThatCantBeEmpty.forEach((selector) => {
    if ($(selector).val().trim() == '') {
      insertError(selector, "This cannot be empty.");
      errors.push(selector);
    }
  });
  
  integerInputs.forEach((selector) => {
    if (isNaN(parseInt($(selector).val().trim())) && !errors.includes(selector)) {
      insertError(selector, "This should be an integer.");
      errors.push(selector);
    }
  });

  $(".city-input").each(function() {
    if ($(this).val().trim() === '') {
      const selector = '#' + $(this).attr('id');
      insertError(selector, "This cannot be empty.");
      errors.push(selector);
    }
  });

  if (!editingExistingCountry() && files.length === 0) {
    selector = "#display-image"
    insertError(selector, "Please upload a flag image.");
    errors.push(selector);
  }
  
  return errors.length == 0;
}

function insertError(selector, message) {
  const errorDiv = $("<div class='input-error'>").text(message);
  $(errorDiv).insertAfter(selector);
}

function clearErrors() {
  $("div").remove(".input-error");
}

function editingExistingCountry() {
  return data.country;
}

function showDiscardChangesConfirmation() {
  const message = "Are you sure you want to discard your changes?";
  if (confirm(message)) location.replace(`/countries/${data.country.id}`);
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (error) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}