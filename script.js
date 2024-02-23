$(document).ready(() => {
  let map = null;

  function displayMap(lat, lon) {
    if (!map) {
      map = L.map("map").setView([lat, lon], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
    } else {
      map.setView([lat, lon], 13);
    }
  }

  function displayLocation(ipAddress) {
    $.get("https://ipinfo.io/" + ipAddress + "/json", function (response) {
      $("#ip").text(response.ip);
      $("#location").text(response.city + "/" + response.country);
      $("#timezone").text(response.timezone);
      $("#isp").text(response.org.split(" ").slice(1).join(" "));

      $("#search").val("");

      $.get(
        "https://ipinfo.io/" + response.ip + "/geo",
        function (location) {
          var coords = location.loc.split(",");
          var lat = parseFloat(coords[0]);
          var lon = parseFloat(coords[1]);

          displayMap(lat, lon);

          L.marker([lat, lon])
            .addTo(map)
            .bindPopup("Your IP Address Location")
            .openPopup();
        },
        "jsonp"
      );
    });
  }

  $.get(
    "https://ipinfo.io",
    function (response) {
      var ipAddress = response.ip;
      displayLocation(ipAddress);
    },
    "jsonp"
  );

  $("#submitBtn").click(() => {
    var ipAddress = $("#search").val();

    if (isValidIpAddress(ipAddress)) {
      displayLocation(ipAddress);
    } else {
      alert("Please enter a valid IP address.");
    }
  });

  function isValidIpAddress(ipAddress) {
    var ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    return ipPattern.test(ipAddress);
  }
});
