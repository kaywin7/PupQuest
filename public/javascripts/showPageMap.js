mapboxgl.accessToken = mapToken;
let data1;
if (shelter) {
    data1 = shelter;
}
else {
    data1 = vect;
}
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: data1.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});


const marker1 = new mapboxgl.Marker()
    .setLngLat(data1.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${data1.title}</h3><p>${data1.location}</p>`
            )
    )
    .addTo(map);