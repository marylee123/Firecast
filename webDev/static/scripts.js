let map, heatmap;
let heatmapData = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: 37.7749, lng: -122.4194 }, 
        mapTypeId: 'roadmap'
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: [],
        map: map
    });

    // Event listeners
    document.getElementById('loadData').addEventListener('click', loadData);
    document.getElementById('toggleHeatmap').addEventListener('click', toggleHeatmap);
}

function loadData() {
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;

    fetch(`/get_prediction?month=${month}&day=${day}`)
        .then(response => response.json())
        .then(data => {
            heatmapData = data.map(item => {
                return {
                    location: new google.maps.LatLng(item.latitude, item.longitude),
                    weight: item.prediction
                };
            });
            heatmap.setData(heatmapData);
            // Adjust map center and zoom if needed
            if (heatmapData.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                heatmapData.forEach(point => bounds.extend(point.location));
                map.fitBounds(bounds);
            }
        });
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

// Initialize the map
google.maps.event.addDomListener(window, 'load', initMap);
