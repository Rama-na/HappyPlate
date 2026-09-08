/**
 * Image manifest.
 *
 * All photography is the club's own, cropped from the supplied originals to
 * remove baked-in text and social-post furniture. Each entry carries a WebP and
 * a JPEG srcset plus intrinsic dimensions, so <Picture> can reserve space and
 * avoid layout shift.
 */

import heroW1320 from './hero-1320.webp';
import heroW900 from './hero-900.webp';
import heroW600 from './hero-600.webp';
import heroJ1320 from './hero-1320.jpg';
import heroJ900 from './hero-900.jpg';
import heroJ600 from './hero-600.jpg';

import tableW640 from './table-640.webp';
import tableW420 from './table-420.webp';
import tableJ640 from './table-640.jpg';
import tableJ420 from './table-420.jpg';

import atmW1320 from './atmosphere-1320.webp';
import atmW900 from './atmosphere-900.webp';
import atmW600 from './atmosphere-600.webp';
import atmJ1320 from './atmosphere-1320.jpg';
import atmJ900 from './atmosphere-900.jpg';
import atmJ600 from './atmosphere-600.jpg';

import flowW580 from './detail-flowers-580.webp';
import flowW380 from './detail-flowers-380.webp';
import flowJ580 from './detail-flowers-580.jpg';
import flowJ380 from './detail-flowers-380.jpg';

import setW900 from './detail-setting-900.webp';
import setW560 from './detail-setting-560.webp';
import setJ900 from './detail-setting-900.jpg';
import setJ560 from './detail-setting-560.jpg';

import archW900 from './detail-arch-900.webp';
import archW560 from './detail-arch-560.webp';
import archJ900 from './detail-arch-900.jpg';
import archJ560 from './detail-arch-560.jpg';

import mirrorW610 from './detail-mirror-610.webp';
import mirrorW400 from './detail-mirror-400.webp';
import mirrorJ610 from './detail-mirror-610.jpg';
import mirrorJ400 from './detail-mirror-400.jpg';

export interface ImageAsset {
  webp: string;
  jpg: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

const set = (parts: [string, number][]) => parts.map(([url, w]) => `${url} ${w}w`).join(', ');

export const IMAGES = {
  hero: {
    webp: set([[heroW600, 600], [heroW900, 900], [heroW1320, 1320]]),
    jpg: set([[heroJ600, 600], [heroJ900, 900], [heroJ1320, 1320]]),
    src: heroJ1320, width: 1320, height: 1164,
    alt: 'The Happy Plate table laid for dinner beneath a softly backlit arch, with lilies at its centre.',
  },
  table: {
    webp: set([[tableW420, 420], [tableW640, 640]]),
    jpg: set([[tableJ420, 420], [tableJ640, 640]]),
    src: tableJ640, width: 640, height: 1290,
    alt: 'A round mirror on rose-patterned wallpaper beside the long table and its dark velvet chairs.',
  },
  atmosphere: {
    webp: set([[atmW600, 600], [atmW900, 900], [atmW1320, 1320]]),
    jpg: set([[atmJ600, 600], [atmJ900, 900], [atmJ1320, 1320]]),
    src: atmJ1320, width: 1320, height: 800,
    alt: 'The full length of the supper table, set with gold-embroidered linen and ringed by chairs.',
  },
  flowers: {
    webp: set([[flowW380, 380], [flowW580, 580]]),
    jpg: set([[flowJ380, 380], [flowJ580, 580]]),
    src: flowJ580, width: 580, height: 620,
    alt: 'Lilies in a brass vase at the centre of the table.',
  },
  setting: {
    webp: set([[setW560, 560], [setW900, 900]]),
    jpg: set([[setJ560, 560], [setJ900, 900]]),
    src: setJ900, width: 900, height: 323,
    alt: 'Gold-embroidered placemats running the length of white table linen.',
  },
  arch: {
    webp: set([[archW560, 560], [archW900, 900]]),
    jpg: set([[archJ560, 560], [archJ900, 900]]),
    src: archJ900, width: 900, height: 473,
    alt: 'Warm light spilling from behind the arch at the head of the room.',
  },
  mirror: {
    webp: set([[mirrorW400, 400], [mirrorW610, 610]]),
    jpg: set([[mirrorJ400, 400], [mirrorJ610, 610]]),
    src: mirrorJ610, width: 610, height: 610,
    alt: 'A dark round mirror hung on rose-patterned wallpaper.',
  },
} satisfies Record<string, ImageAsset>;
