import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { format } from 'date-fns';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons based on verification status
const createIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  VERIFIED: createIcon('green'),
  UNVERIFIED: createIcon('red'),
  default: createIcon('blue')
};

interface EventData {
  id: string;
  title: string;
  event_category: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  verification_status: string;
  confidence_score: number;
  report_count: number;
  updated_at: string;
}

interface MapComponentProps {
  events: EventData[];
  className?: string;
}

export default function MapComponent({ events, className }: MapComponentProps) {
  const validEvents = events.filter(e => e.latitude && e.longitude);
  
  const wrapperClass = className || "h-[500px] w-full rounded-2xl overflow-hidden border border-border shadow-2xl relative z-0";

  return (
    <div className={wrapperClass}>
      <MapContainer 
        center={[20.5937, 78.9629]} // Center of India
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <LayersControl position="topright">
          {/* Base Maps */}
          <LayersControl.BaseLayer checked name="Standard View">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topographic View">
            <TileLayer
              attribution='&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Overlays */}
          <LayersControl.Overlay checked name="Active Events">
            <div className="layer-group">
              {validEvents.map((event) => (
                <Marker 
                  key={event.id} 
                  position={[event.latitude!, event.longitude!]}
                  icon={event.verification_status === 'VERIFIED' ? icons.VERIFIED : icons.UNVERIFIED}
                >
                  <Popup className="custom-popup">
                    <div className="font-sans">
                      <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium text-primary-foreground ${event.verification_status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                          {event.verification_status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Conf: {event.confidence_score.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Location:</strong> {event.city}
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Reports:</strong> {event.report_count} clustered
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Last updated: {format(new Date(event.updated_at), 'MMM d, HH:mm')}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </div>
          </LayersControl.Overlay>
          
          <LayersControl.Overlay name="NDRF Relief Units (Simulated)">
            <div className="layer-group">
              {validEvents.map((event, idx) => (
                <CircleMarker
                  key={`ndrf-${idx}`}
                  center={[event.latitude! + 0.1, event.longitude! - 0.1]}
                  pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.7 }}
                  radius={8}
                >
                  <Popup>
                    <strong>NDRF Alpha Team {idx + 1}</strong><br/>
                    Status: En Route<br/>
                    ETA: 45 mins
                  </Popup>
                </CircleMarker>
              ))}
            </div>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
