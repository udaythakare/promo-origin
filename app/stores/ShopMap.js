import { useEffect, useRef } from 'react';

export const ShopMap = ({ lat, lng, shopName }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const openInGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(shopName)}`;
    window.open(googleMapsUrl, '_blank');
  };

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.head.appendChild(script);

        return new Promise((resolve) => {
          script.onload = resolve;
        });
      }
    };

    const initMap = async () => {
      await loadLeaflet();
      
      if (mapRef.current && window.L && !mapInstanceRef.current) {
        const map = window.L.map(mapRef.current).setView([lat, lng], 17);
        
        // Use satellite imagery for better location visibility
        window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri',
          maxZoom: 19
        }).addTo(map);
        
        // Custom marker
        const customIcon = window.L.divIcon({
          html: `<div style="background: #dc2626; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: 'custom-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = window.L.marker([lat, lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center;">
              <strong>${shopName}</strong><br>
              <button onclick="(() => {
                const url = 'https://www.google.com/maps/search/?api=1&query=${lat},${lng}';
                window.open(url, '_blank');
              })()" style="
                background: #1f2937; 
                color: white; 
                border: none; 
                padding: 5px 10px; 
                border-radius: 4px; 
                cursor: pointer; 
                margin-top: 5px;
              ">Get Directions</button>
            </div>
          `);

        // Click marker to open Google Maps
        marker.on('click', openInGoogleMaps);
        
        mapInstanceRef.current = map;
      }
    };

    if (lat && lng) {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, shopName]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg cursor-pointer"
        style={{ minHeight: '300px' }}
        onClick={openInGoogleMaps}
      />
      <div className="absolute bottom-2 right-2">
        <button
          onClick={openInGoogleMaps}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded shadow-lg"
        >
          📍 Directions
        </button>
      </div>
    </div>
  );
};