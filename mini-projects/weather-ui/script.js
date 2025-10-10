let MOCK = {};

// Fetch data.json and load the city names
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    MOCK = data; // store it globally so your other code can use it too

    // Populate available city list
    for (const key in MOCK) {
      const li = document.createElement("li");
      li.textContent = data[key].name;
      cityNames.appendChild(li);
    }
  })
  .catch(err => console.error("Error loading data:", err));

// -------------------- DOM SELECTORS --------------------
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const card = document.getElementById("card");

const cityNameEl = document.getElementById("city-name");
const countryEl = document.getElementById("country");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("description");
const iconEl = document.getElementById("icon");
const feelsEl = document.getElementById("feels");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

const buttonGetWeather = document.getElementById("get-weather");

const showCitiesBtn = document.getElementById("showCitiesBtn");
const cityList = document.getElementById("cityList");
const cityNames = document.getElementById("cityNames");
const closeListBtn = document.getElementById("closeListBtn");

cityInput.placeholder = "Enter city name";
cityInput.style.borderColor = "";

cityInput.addEventListener("input", () => {
  cityInput.style.borderColor = "";
  cityInput.placeholder = "Enter city name";
});

buttonGetWeather.addEventListener('click', function(e){
  e.preventDefault();
  const text = cityInput.value.trim().toLowerCase();
  if (MOCK[text]){
    card.classList.remove("hidden");

    Simulateloading(text);

    // ✅ reset visuals
    cityInput.style.borderColor = "";
    cityInput.placeholder = "Enter city name";
  }else if(text === ""){
    cityInput.placeholder = "⚠ Please enter something!";
    cityInput.style.borderColor = "red";
  }else{
    cityInput.placeholder = `There is no data for ${text} in our Dictionary`;
    cityInput.style.borderColor = "red";
  }
  cityInput.value = "";
});

function get_data(item){
    cityNameEl.innerHTML = item.name.toUpperCase();
    countryEl.innerHTML = item.country.toUpperCase();
    descEl.innerHTML = item.description;
    tempEl.innerHTML = item.temp;
    feelsEl.innerHTML = item.feels;
    humidityEl.innerHTML = item.humidity;
    windEl.innerHTML = item.wind;
    iconEl.innerHTML = item.icon;
}

function Simulateloading(text) {
  // show a short loading UX 
  cityNameEl.textContent = "Loading..."; 
  tempEl.textContent = "--"; 
  descEl.textContent = "---";
  countryEl.textContent = "--";
  feelsEl.textContent = "--";
  humidityEl.textContent = "--";
  windEl.textContent = "--"; 
  iconEl.textContent = "⏳";
  iconEl.classList.add("loading"); // start spinning
  setTimeout(() => {
    iconEl.classList.remove("loading"); // stop spinning
    const item = MOCK[text]
    get_data(item);
  }, 3000);
}

// Toggle list visibility
showCitiesBtn.addEventListener("click", () => {
  cityList.style.display = "block";
  showCitiesBtn.style.display = "none";
});

closeListBtn.addEventListener("click", () => {
  cityList.style.display = "none";
  showCitiesBtn.style.display = "inline-block";
});
