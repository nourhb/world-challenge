declare module 'leaflet' {
  interface LatLng {
    lat: number;
    lng: number;
  }

  interface LeafletMouseEvent {
    latlng: LatLng;
  }

  interface MapOptions {
    worldCopyJump?: boolean;
    minZoom?: number;
    maxZoom?: number;
  }

  interface TileLayerOptions {
    attribution?: string;
    maxZoom?: number;
    subdomains?: string;
  }

  interface CircleMarkerOptions {
    radius?: number;
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
    weight?: number;
  }

  interface CircleMarker {
    remove(): this;
    addTo(map: Map): this;
  }

  interface TileLayer {
    addTo(map: Map): this;
  }

  interface Map {
    setView(center: [number, number], zoom: number): this;
    on(event: 'click', handler: (event: LeafletMouseEvent) => void): this;
    remove(): void;
    invalidateSize(): this;
  }

  interface LeafletStatic {
    map(element: HTMLElement, options?: MapOptions): Map;
    tileLayer(url: string, options?: TileLayerOptions): TileLayer;
    circleMarker(latlng: [number, number], options?: CircleMarkerOptions): CircleMarker;
  }

  const L: LeafletStatic;
  export default L;
}

declare module 'leaflet/dist/leaflet.css';
