const socket = io(); // Assuming socket.io is properly configured

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude }); // Corrected: Changed `socket.email` to `socket.emit`
        },
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// Make sure Leaflet library is properly included in your project
const map = L.map("map").setView([0, 0], 16);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", // Corrected: Removed `[cyclosm|cyclosm-lite]`
    {
        attribution: "OpenStreetMap"
    }
).addTo(map);

const marker ={};

socket.on("receive-location",(data)=>{
    const{id,latitude,longitude} =data;
    map.setView([latitude,longitude]);
    if(marker[id]){
        marker[id].setLatLng([latitude,longitude]);
    }else{
        marker[id] = L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnet",(id)=>{
    if(marker[id]){
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});