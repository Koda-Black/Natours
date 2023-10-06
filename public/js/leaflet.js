/*eslint-disable*/

export const displayMap = (locations) => {
  var map = L.map('map', { zoomControl: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    crossOrigin: '',
  }).addTo(map);

  const points = [];
  locations.forEach((loc) => {
    // // Create marker for each location
    // const el = document.createElement('div');
    // el.className = 'marker';
    // new L.marker({
    //   element: el,
    //   anchor: 'bottom',
    // });
    // Add marker for each location
    points.push([loc.coordinates[1], loc.coordinates[0]]);
    L.marker([loc.coordinates[1], loc.coordinates[0]])
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
      })
      .openPopup();
  });

  // Extend map bounds to include current location
  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);

  map.scrollWheelZoom.disable();

  // To avoid map dragging
  var map =
    map != null
      ? map
      : L.map('map', {
          zoomControl: false,
          center: [51.505, -0.09],
          zoom: 13,
          dragging: false,
        });
};
