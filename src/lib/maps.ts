import type { LatLngBoundsExpression } from 'leaflet';

// Verified against CODH's georef pages and Map Warper metadata, 2026-11-13.
// Bounds describe the raster extent, not an exact historical district boundary.
export const historicalSheets = [
  { id: 4908, title: '芝高輪辺絵図', year: 1850, sheet: '05', ndl: '1286663', bounds: [[35.602878, 139.710399], [35.664301, 139.767216]] },
  { id: 4902, title: '日本橋北神田浜町絵図', year: 1850, sheet: '03', ndl: '1286645', bounds: [[35.673639, 139.753907], [35.701571, 139.800909]] },
  { id: 4930, title: '本所絵図', year: 1852, sheet: '16', ndl: '1286679', bounds: [[35.689161, 139.784803], [35.717931, 139.836300]] },
  { id: 4931, title: '浅草御蔵前辺図', year: 1853, sheet: '17', ndl: '1286209', bounds: [[35.687414, 139.777945], [35.720622, 139.804852]] },
  { id: 4935, title: '今戸箕輪浅草絵図', year: 1853, sheet: '21', ndl: '1286208', bounds: [[35.705124, 139.772138], [35.767812, 139.828530]] },
] satisfies Array<{ id: number; title: string; year: number; sheet: string; ndl: string; bounds: LatLngBoundsExpression }>;

export const mapSources = {
  modernTiles: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  modernAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  historicalTiles: (id: number) => `https://mapwarper.h-gis.jp/maps/tile/${id}/{z}/{x}/{y}.png`,
  historicalAttribution: '<a href="https://dl.ndl.go.jp/">國立國會圖書館</a> · <a href="https://codh.rois.ac.jp/edo-maps/">CODH</a> · Tiles: <a href="https://mapwarper.h-gis.jp/users/340">Kitamoto / Map Warper</a>',
};
