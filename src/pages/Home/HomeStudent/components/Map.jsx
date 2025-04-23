import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';

const customIcon = new L.Icon({
  icon: <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M32.5625 27.3291C34.9591 24.4404 36.4 20.7301 36.4 16.6833C36.4 7.46938 28.9306 0 19.7167 0C10.5027 0 3.03333 7.46938 3.03333 16.6833C3.03333 20.763 4.49769 24.5007 6.92945 27.3994C6.5796 27.3341 6.21878 27.3 5.85 27.3C2.61913 27.3 0 29.9191 0 33.15C0 36.3809 2.61913 39 5.85 39C7.68772 39 9.32753 38.1526 10.4 36.8273C11.4725 38.1526 13.1123 39 14.95 39C16.7877 39 18.4275 38.1526 19.5 36.8273C20.5725 38.1526 22.2123 39 24.05 39C25.8877 39 27.5275 38.1526 28.6 36.8273C29.6725 38.1526 31.3123 39 33.15 39C36.3809 39 39 36.3809 39 33.15C39 29.9191 36.3809 27.3 33.15 27.3C32.9517 27.3 32.7557 27.3099 32.5625 27.3291Z" fill="#8A48E6"/>
  </svg>
  , 
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

function LocateUser() {
  const map = useMap();
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
        },
        (error) => {
          toast.error('Ошибка получения местоположения!');
        }
      );
    }
  }, [map]);
  return null;
}

export default function Map() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          toast.error('Ошибка получения местоположения!');
        }
      );
    }
  }, []);

  return (
    <div className="relative w-full h-[33vh] rounded-[20px] shadow-md overflow-hidden ">
        <div className="absolute top-[20px] left-[60px] flex gap-4 z-[9999]">
        <div className="w-[156px] h-12 p-2 bg-white rounded-2xl border border-[#d7d7d7] flex justify-between items-center">
          <div className="text-[#827ead] text-[15px] font-bold font-['Nunito']">Усі предмети</div>
          <div data-svg-wrapper>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14.5V15M12 15L18 9M12 15L6 9" stroke="#827FAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="w-[156px] h-12 p-2 bg-white rounded-2xl border border-[#d7d7d7] flex justify-between items-center">
          <div className="text-[#827ead] text-[15px] font-bold font-['Nunito']">Формат</div>
          <div data-svg-wrapper>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14.5V15M12 15L18 9M12 15L6 9" stroke="#827FAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="w-[156px] h-12 p-2 bg-white rounded-2xl border border-[#d7d7d7] flex justify-between items-center">
          <div className="text-[#827ead] text-[15px] font-bold font-['Nunito']">Вид навчання</div>
          <div data-svg-wrapper>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14.5V15M12 15L18 9M12 15L6 9" stroke="#827FAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Кнопка действия */}
      <div className="absolute top-4 right-4 z-[9999]">
        <div data-svg-wrapper>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="24" fill="white" />
            <path
              d="M36 36L28 28M12 21.3333C12 22.559 12.2414 23.7727 12.7105 24.905C13.1795 26.0374 13.867 27.0663 14.7337 27.933C15.6004 28.7997 16.6292 29.4872 17.7616 29.9562C18.894 30.4253 20.1077 30.6667 21.3333 30.6667C22.559 30.6667 23.7727 30.4253 24.905 29.9562C26.0374 29.4872 27.0663 28.7997 27.933 27.933C28.7997 27.0663 29.4872 26.0374 29.9562 24.905C30.4253 23.7727 30.6667 22.559 30.6667 21.3333C30.6667 20.1077 30.4253 18.894 29.9562 17.7616C29.4872 16.6292 28.7997 15.6004 27.933 14.7337C27.0663 13.867 26.0374 13.1795 24.905 12.7105C23.7727 12.2414 22.559 12 21.3333 12C20.1077 12 18.894 12.2414 17.7616 12.7105C16.6292 13.1795 15.6004 13.867 14.7337 14.7337C13.867 15.6004 13.1795 16.6292 12.7105 17.7616C12.2414 18.894 12 20.1077 12 21.3333Z"
              stroke="#120C38"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <MapContainer
        center={position || [49.991655371485066, 36.23448138547258]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Map layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Position */}
        {position && (
          <Marker position={position} icon={customIcon}>
            <Popup>
              Ваше поточне місцезнаходження
            </Popup>
          </Marker>
        )}

        {/* Center user */}
        <LocateUser />
      </MapContainer>

      
    </div>
  );
}