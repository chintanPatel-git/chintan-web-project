mapboxgl.accessToken = mapToken;
mapboxgl.accessToken =
  "pk.eyJ1IjoiY2hpbnRhbnBhdGVsNzYiLCJhIjoiY20zcjVpbGg2MDF1YjJsc2Jpdjl6ZG82NiJ9.W8UvnvtvzcEXBB_eDUmfQg";
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  //Listing.geometry.coordinates

  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
    )
  )
  .addTo(map);
