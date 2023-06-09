mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: vect.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});


const marker1 = new mapboxgl.Marker()
    .setLngLat(vect.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${vect.title}</h3><p>${vect.location}</p>`
            )
    )
    .addTo(map);