$(document).ready(() => {
  $.get(
    "https://ipinfo.io",
    (response) => {
      $("#ip").text(response.ip);
      $("#location").text(response.city + "/" + response.country);
      $("#timezone").text(response.timezone);
      $("#isp").text(response["org"].split(" ").slice(1).join(" "));

      $.get(
        "https://ipinfo.io/" + response.ip + "/geo",
        (location) => {
          var coords = location.loc.split(",");
          var lat = parseFloat(coords[0]);
          var lon = parseFloat(coords[1]);

          var map = L.map("map").setView([lat, lon], 13);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          L.marker([lat, lon])
            .addTo(map)
            .bindPopup("Your IP Address Location")
            .openPopup();
        },
        "jsonp"
      );
    },
    "jsonp"
  );
});
