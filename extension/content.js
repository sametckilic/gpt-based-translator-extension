let country;

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

async function checkServer() {
  const translateUrl = "http://localhost:3000/translate";
  await fetch(translateUrl).then((res) => {
    console.log(res);
  });
}

async function getTranslatedText(text, language) {
  console.log(country, "countrycode");
  const translateUrl = "http://localhost:3000/translate";
  try {
    const response = await fetch(translateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        language: language,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data; // Translate edilmiş metni döndür
    } else {
      throw new Error("Translation request failed");
    }
  } catch (error) {
    console.error("Error during translation:", error);
    return null; // Hata durumunda null döndür
  }
}

var hoverTimer; // Zamanlayıcı değişkeni
var tooltipTimeout = 3000; // 0.75 saniye
var hoveredElement = "";
document.addEventListener("mouseover", async function (e) {
  hoveredElement = e.target;
  hoverTimer = setTimeout(async function () {
    var hoveredText = hoveredElement.textContent.trim();

    if (hoveredText.length > 0) {
      var tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.style.position = "absolute";
      tooltip.style.border = "1px solid black";
      tooltip.style.background = "white";
      tooltip.style.color = "black";
      tooltip.style.padding = "5px";
      tooltip.style.zIndex = "1000";
      tooltip.innerText = "Please wait for translate...";
      tooltip.style.left = e.pageX + "px";
      tooltip.style.top = e.pageY + "px";
      document.body.appendChild(tooltip);

      try {
        var translatedText = await getTranslatedText(
          hoveredElement.textContent,
          country
        );
        console.log(translatedText);
        tooltip.innerText = translatedText.message; // Çevirilen metni tooltip içine ekle
      } catch (error) {
        console.error("Translation error:", error);
        tooltip.innerText = "Translation failed"; // Hata durumunda tooltip içine hata mesajı ekle
      }
    }
  }, tooltipTimeout);
});

document.addEventListener("mouseout", function () {
  clearTimeout(hoverTimer); // Zamanlayıcıyı temizler
  var tooltips = document.querySelectorAll(".tooltip");
  tooltips.forEach(function (tooltip) {
    hoveredElement = "";
    tooltip.remove();
  });
});
