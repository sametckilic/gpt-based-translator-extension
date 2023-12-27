var hoverTimer; // Zamanlayıcı değişkeni
var tooltipTimeout = 3000; // 3 saniye

document.addEventListener("mouseover", function (e) {
  var hoveredElement = e.target;
  hoverTimer = setTimeout(function () {
    var hoveredText = hoveredElement.textContent.trim();
    if (hoveredText.length > 0) {
      var tooltip = document.createElement("div");
      tooltip.textContent = hoveredText;
      Object.assign(tooltip.style, {
        position: "absolute",
        border: "1px solid black",
        background: "white",
        padding: "5px",
        zIndex: "1000",
        left: e.pageX + "px",
        top: e.pageY + "px",
        transition: "opacity 0.3s",
        opacity: "0",
        visibility: "hidden",
        borderRadius: "6px",
        color: "#fff",
        textAlign: "center",
        width: "120px",
      });
      document.body.appendChild(tooltip);
    }
  }, tooltipTimeout);
});

document.addEventListener("mouseout", function () {
  clearTimeout(hoverTimer); // Zamanlayıcıyı temizler
  var tooltips = document.querySelectorAll("div");
  tooltips.forEach(function (tooltip) {
    tooltip.remove();
  });
});
