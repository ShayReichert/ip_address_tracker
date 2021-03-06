const ipify_api_key = "at_JePWenmcjHY6iwLrvmlN0iZtdg9Kc";
const mapbox_access_token =
  "pk.eyJ1Ijoic2hheWt1cnR6IiwiYSI6ImNrZ3doMG1sNjAyYW4yeXJzZ3pmOGEycHAifQ.gyqXExQTpBPfipzRyn-QCw";

// Initial Map
const customIcon = L.icon({
  iconUrl:
    "https://shayreichert.github.io/ip_address_tracker/images/icon-location.svg",
  iconSize: [42, 50],
});
const mymap = L.map("mapid").setView([51.505, -0.09], 13);
const marker = L.marker([51.5, -0.09], { icon: customIcon }).addTo(mymap);
const mapOptions = {
  maxZoom: 18,
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: "mapbox/streets-v11",
  tileSize: 512,
  zoomOffset: -1,
};
L.tileLayer(
  `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapbox_access_token}`,
  mapOptions
).addTo(mymap);

initialUserAddress = () => {
  document.querySelector(".button").click();
};
window.onload = initialUserAddress;

// IP search
const searchBar = document.querySelector(".search-bar");
searchBar.addEventListener("submit", getLocation);

async function getLocation(event) {
  event.preventDefault();
  const inputValue = document.querySelector(".search-input").value;
  await fetch(
    `https://geo.ipify.org/api/v1?apiKey=${ipify_api_key}&ipAddress=${inputValue}`
  )
    .then((data) => {
      if (data.status != 200) {
        document.querySelector(".ip-insert").textContent =
          "Invalid IP adress !";
        console.log("invalid IP");
      } else {
        return data.json();
      }
    })
    .then((data) => {
      goToIPLocation(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

const goToIPLocation = (infos) => {
  // Display infos
  const { ip, location, isp } = infos;
  const ipInsert = document.querySelector(".ip-insert");
  const cityInsert = document.querySelector(".city-insert");
  const postalCodeInsert = document.querySelector(".postalCode-insert");
  const utcInsert = document.querySelector(".utc-insert");
  const ispInsert = document.querySelector(".isp-insert");
  ipInsert.textContent = ip;
  cityInsert.textContent = `${location.city}, ${location.region}`;
  postalCodeInsert.textContent = location.postalCode;
  utcInsert.textContent = location.timezone;
  ispInsert.textContent = isp;

  // Update Map
  mymap.flyTo([location.lat, location.lng], 13);
  marker.setLatLng([location.lat, location.lng]).bindPopup(location.city);
};
