var country_code;

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        country = data.address.country_code;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  (err) => {
    console.log("Lat, lon alinamadi" + err);
  },
  { timeout: 5000, enableHighAccuracy: true }
);

const getTranslatedText = (text) => {};

var hoverTimer; // Zamanlayıcı değişkeni
var tooltipTimeout = 3000; // 0.75 saniye

document.addEventListener("mouseover", function (e) {
  var hoveredElement = e.target;
  hoverTimer = setTimeout(function () {
    var hoveredText = hoveredElement.textContent.trim();
    var translatedText = getTranslatedText(hoveredText);
    if (hoveredText.length > 0) {
      var tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.style.position = "absolute";
      tooltip.style.border = "1px solid black";
      tooltip.style.background = "white";
      tooltip.style.color = "black";
      tooltip.style.padding = "5px";
      tooltip.style.zIndex = "1000";
      tooltip.innerText = hoveredText;
      tooltip.style.left = e.pageX + "px";
      tooltip.style.top = e.pageY + "px";
      document.body.appendChild(tooltip);
    }
  }, tooltipTimeout);
});

document.addEventListener("mouseout", function () {
  clearTimeout(hoverTimer); // Zamanlayıcıyı temizler
  var tooltips = document.querySelectorAll(".tooltip");
  tooltips.forEach(function (tooltip) {
    tooltip.remove();
  });
});
