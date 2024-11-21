import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

// Define custom icons
const userIcon = L.icon({
  iconUrl: "https://img.icons8.com/color/48/person-male.png", // User location icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const policeStationIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2237/2237750.png", // Police badge icon from Flaticon
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [20, 40], // Anchor the icon to the bottom center
    popupAnchor: [0, -40], // Position the popup above the icon
  });
  
  

const MapPage = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [policeStations, setPoliceStations] = useState([]);
  const [nearestStation, setNearestStation] = useState(null);

  const PanToCurrentLocation = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView([position.lat, position.lng], 14);
      }
    }, [position, map]);
    return null;
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      },
      (error) => console.error("Error fetching location:", error)
    );
  };

  const fetchNearbyPoliceStations = async () => {
    if (!currentPosition) return;

    const { lat, lng } = currentPosition;
    const query = `
      [out:json];
      node
        [amenity=police]
        (around:5000, ${lat}, ${lng});
      out body;
    `;

    try {
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      const stations = data.elements.map((el) => ({
        id: el.id,
        lat: el.lat,
        lon: el.lon,
        name: el.tags.name || "Unnamed Police Station",
      }));
      setPoliceStations(stations);

      if (stations.length > 0) {
        setNearestStation(stations[0]);
      }
    } catch (error) {
      console.error("Error fetching police stations:", error);
    }
  };

  const addRouteToNearestStation = (map) => {
    if (!currentPosition || !nearestStation) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(currentPosition.lat, currentPosition.lng),
        L.latLng(nearestStation.lat, nearestStation.lon),
      ],
      routeWhileDragging: true,
    });

    routingControl.addTo(map);

    return () => map.removeControl(routingControl);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentPosition) {
      fetchNearbyPoliceStations();
    }
  }, [currentPosition]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px auto",
        maxWidth: "90%",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#f9f9f9",
        padding: "20px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "10px",
        }}
      >
        Find Nearby Police Stations
      </h2>
      <MapContainer
        center={[12.971598, 77.594566]}
        zoom={13}
        style={{
          height: "500px",
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {currentPosition && (
          <>
            <Marker
              position={[currentPosition.lat, currentPosition.lng]}
              icon={userIcon} // Use the custom user icon
            >
              <Popup>
                <b style={{ color: "#007bff" }}>Your Location</b>
              </Popup>
            </Marker>
            <PanToCurrentLocation position={currentPosition} />
          </>
        )}

        {policeStations.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lon]}
            icon={policeStationIcon} // Use the custom police station icon
          >
            <Popup>
              <b style={{ color: "#007bff" }}>{station.name}</b>
            </Popup>
          </Marker>
        ))}

        {nearestStation && (
          <MapContainer whenCreated={(map) => addRouteToNearestStation(map)} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapPage;
