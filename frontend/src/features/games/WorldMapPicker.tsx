import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';

interface WorldMapPickerProps {
  disabled: boolean;
  onConfirm: (answer: string) => void;
}

export function WorldMapPicker({ disabled, onConfirm }: WorldMapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef(disabled);
  const [pin, setPin] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );

  disabledRef.current = disabled;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const map = L.map(element, { worldCopyJump: true, minZoom: 2, maxZoom: 8 }).setView(
      [20, 12],
      2,
    );
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 8,
    }).addTo(map);

    let marker: ReturnType<typeof L.circleMarker> | null = null;
    const onClick = (event: { latlng: { lat: number; lng: number } }) => {
      if (disabledRef.current) {
        return;
      }
      const latitude = Number(event.latlng.lat.toFixed(4));
      const longitude = Number(event.latlng.lng.toFixed(4));
      setPin({ latitude, longitude });
      marker?.remove();
      marker = L.circleMarker([latitude, longitude], {
        radius: 8,
        color: '#3ee0c5',
        fillColor: '#3ee0c5',
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(map);
    };

    map.on('click', onClick);
    const resize = window.setTimeout(() => map.invalidateSize(), 80);

    return () => {
      window.clearTimeout(resize);
      map.remove();
    };
  }, []);

  return (
    <div className="mt-4">
      <div
        ref={containerRef}
        className="h-80 w-full overflow-hidden rounded-2xl border border-white/10"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <p className="text-xs text-mist">
          {pin
            ? `Pin ${pin.latitude.toFixed(2)}, ${pin.longitude.toFixed(2)}`
            : 'Click the map. Closer than 500 km counts as a hit.'}
        </p>
        <button
          type="button"
          disabled={disabled || !pin}
          onClick={() => {
            if (!pin) {
              return;
            }
            onConfirm(`${pin.latitude},${pin.longitude}`);
          }}
          className="rounded-xl bg-cyan px-4 py-2 text-sm font-bold uppercase text-void disabled:opacity-50"
        >
          Lock pin
        </button>
      </div>
    </div>
  );
}
