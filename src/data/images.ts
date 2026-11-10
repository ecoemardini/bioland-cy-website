// Image registry: every picture on the site, with its alt text, caption and credit.
// AI images carry the EU "AI-generated" icon and a caption, as in the printed kit (rule of 22 Oct 2026).
import type { ImageMetadata } from 'astro';

const eo = import.meta.glob<{ default: ImageMetadata }>('../assets/img/eo/*.jpg', { eager: true });
const ai = import.meta.glob<{ default: ImageMetadata }>('../assets/img/ai/*.jpg', { eager: true });
const layers = import.meta.glob<{ default: ImageMetadata }>('../assets/img/layers/*.png', { eager: true });
const pick = (g: Record<string, { default: ImageMetadata }>, k: string) => {
  const hit = Object.entries(g).find(([p]) => p.endsWith('/' + k));
  if (!hit) throw new Error('Missing image ' + k);
  return hit[1].default;
};

export const COPERNICUS =
  'Contains modified Copernicus Sentinel data (2025). Copernicus DEM GLO-30 © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided under COPERNICUS by the European Union and ESA.';

export type Pic = {
  src: ImageMetadata;
  alt: string;
  caption: string;
  ai?: boolean;
  people?: boolean;
  recon?: boolean;
  credit?: string;
};

const realData = (k: string, alt: string, caption: string, credit = COPERNICUS): Pic => ({ src: pick(eo, k + '.jpg'), alt, caption, credit });
const aiPic = (k: string, alt: string, caption: string, o: { people?: boolean; recon?: boolean } = {}): Pic => ({
  src: pick(ai, k + '.jpg'), alt, caption, ai: true, ...o,
});

export const IMG = {
  hero: realData('D3', 'The whole island of Cyprus seen from orbit in a Sentinel-2 satellite image; towards the east it dissolves into the square pixels of the BIOLAND-Cy logo.',
    'The island from orbit: a Sentinel-2 image of 15 March 2025, dissolving into the pixel grid of the BIOLAND-Cy logo.'),
  eo3d1: realData('E01_EO3D', 'A three-dimensional satellite view across rolling farmland towards the Troodos mountains.',
    'Sentinel-2 image draped on the Copernicus terrain model, seen in 3D towards the Troodos (real data).'),
  eo3d2: realData('E02_EO3D', 'A three-dimensional satellite view over the folded foothills of the Troodos mountains.',
    'Foothills of the Troodos in 3D: Sentinel-2 on the Copernicus terrain model (real data).'),
  radar: realData('B4', 'Cyprus in Sentinel-1 radar coherence: stable ground in light tones, changing ground in dark blue.',
    'Sentinel-1 radar coherence, autumn 2020: where the ground stays the same and where it changes.',
    'Sentinel-1 coherence: Kellndorfer et al. 2022, Global Seasonal Sentinel-1 Interferometric Coherence (CC BY 4.0).'),
  seasons: realData('D2', 'Two maps of Cyprus side by side: green in spring, pale and dry in summer.',
    'Vegetation index (NDVI) in March and August 2025: the farming year seen from orbit.'),
  // AI reconstructions and illustrative pictures (approved in the D2.1 kit)
  potter: aiPic('S02', 'A potter works outside a round stone-and-mud house in a prehistoric village.', 'Potter outside a round house, c. 3000 BC', { people: true, recon: true }),
  village: aiPic('W01', 'A Neolithic village of round houses seen across a green valley.', 'Neolithic village seen across the valley, c. 6000 BC', { people: true, recon: true }),
  foothills: aiPic('H01', 'Chalk hills and a dry river bed in green foothills.', 'Chalk hills and a dry river bed in the foothills, as they may have looked before farming'),
  cliffs: aiPic('L05B', 'White chalk cliffs above a turquoise sea.', 'White chalk cliffs on the south coast'),
  saltlake: aiPic('L06', 'A shallow coastal salt lake in winter with flamingos.', 'A coastal salt lake in winter, with flamingos'),
  forest: aiPic('L04', 'Pine forest in the mist.', 'Pine and golden oak forest of the Troodos in the mist'),
  satellite: aiPic('M04b', 'A Sentinel-2 satellite in orbit above the whole island of Cyprus.', "A Sentinel-2 satellite over Cyprus (artist's impression)"),
  aerial: aiPic('X01b', 'A village of round houses among small fields, seen from above.', 'Reimagined Chalcolithic village of round houses from 400 m, c. 3000 BC', { people: true, recon: true }),
  mouflon: aiPic('C08', 'A Cyprus mouflon, a wild sheep with curled horns, on a rocky slope.', 'The Cyprus mouflon, a wild sheep found only on Cyprus; its ancestors came with the first farmers'),
  lentils: aiPic('C09', 'Hands holding lentils over a woven basket.', 'Lentils, a staple crop', { people: true }),
  olives: aiPic('C10', 'Hands sorting olives in a basket.', 'Sorting olives', { people: true }),
  carob: aiPic('C11', 'A hand picking carob pods from a tree.', 'Carob pods', { people: true }),
  deer: aiPic('C12', 'A fallow deer stag in a pine forest.', 'Fallow deer, a main source of meat in prehistoric Cyprus'),
  goat: aiPic('C13', 'A goat on a chalk hillside.', 'A goat on a chalk hillside'),
  plough: aiPic('S03', 'A woman ploughs a field with a pair of oxen.', 'Ploughing with oxen, c. 2000 BC', { people: true, recon: true }),
  spinning: aiPic('S04', 'A woman spins wool outside a mud-brick house above a valley.', 'Spinning wool, c. 1900 BC', { people: true, recon: true }),
  bread: aiPic('S06', 'A woman bakes bread at a domed clay oven.', 'Baking bread at a domed clay oven, c. 600 BC', { people: true, recon: true }),
  donkey: aiPic('S07', 'A man leads a pack donkey along a valley path.', 'A man leading a pack donkey along the valley path, c. 600 BC', { people: true, recon: true }),
  threshing: aiPic('S10', 'A man threshes grain with two oxen on a round threshing floor.', 'Threshing on a round threshing floor, 6th century AD', { people: true, recon: true }),
  lab: aiPic('M01', 'Researchers at computers showing satellite maps of Cyprus.', 'Working with satellite maps at the Centre (illustration)', { people: true }),
  field: aiPic('M02', 'A researcher holds a tablet with a map in scrubland.', 'Checking the satellite against the ground (illustration)', { people: true }),
  drone: aiPic('M03', 'A green field with faint circular crop marks seen from a drone.', 'Drone survey over crop marks (illustration)'),
} satisfies Record<string, Pic>;

// The six whole-island layers for the scroll story (same framing, so they crossfade cleanly)
export const LAYERS = [
  { key: 'truecolour', src: pick(layers, 'truecolour.png'), label: 'Satellite image', data: 'Sentinel-2, 15 March 2025',
    title: 'One island, seen whole', text: 'Every pixel of this image is a measurement made by the Copernicus Sentinel-2 satellites, 786 km above Cyprus. It is where our work begins: the land as it is today.' },
  { key: 'ndvi_mar', src: pick(layers, 'ndvi_mar.png'), label: 'Spring vegetation', data: 'Sentinel-2 NDVI, March 2025',
    title: 'Green in spring…', text: 'A vegetation index (NDVI) turns the same image into a map of growth. In March the plains are green with cereals and the hills with fresh grazing.' },
  { key: 'ndvi_aug', src: pick(layers, 'ndvi_aug.png'), label: 'Summer vegetation', data: 'Sentinel-2 NDVI, August 2025',
    title: '…gold by summer', text: 'By August only the mountains, rivers and irrigated fields stay green. The contrast shows where water and growth potential lie, the limits every farming community has faced.' },
  { key: 'terrain', src: pick(layers, 'terrain.png'), label: 'Terrain', data: 'Copernicus DEM GLO-30',
    title: 'The frame of the land', text: 'Plant cover has changed since antiquity, but hills and valleys change far more slowly. The Copernicus elevation model gives us slope, shelter and the effort of moving on foot.' },
  { key: 'coherence', src: pick(layers, 'coherence.png'), label: 'Ground stability', data: 'Sentinel-1 radar coherence',
    title: 'Ground that changes, ground that stays', text: 'Radar sees through cloud. Its coherence shows where the surface stays stable from one pass to the next and where it is ploughed, grazed or grows.' },
  { key: 'water_bold', src: pick(layers, 'water_bold.png'), label: 'Streams and lakes', data: 'Copernicus DEM; JRC Global Surface Water',
    title: 'Where the water runs', text: 'Streams traced from the terrain, and lakes mapped from nearly four decades of Landsat records: the water that decided where people could live, herd and farm.' },
];
