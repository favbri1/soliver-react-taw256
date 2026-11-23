import type { Costume } from '@/types'
import { getPiecesByCostume } from './pieces'
import tr001b from '@/assets/tr001-b.jpg'
import tr002a from '@/assets/tr002-a.jpg'
import achachi from '@/assets/tr005-a.jpg'
import infantecapo from '@/assets/tr006-a.jpg'


import capo1 from '@/assets/capo1.png'
import capoImp from '@/assets/capoimp.png' 
import capoImpReal from '@/assets/capoimpreal.png' 
import chinaEleg from '@/assets/chinaeleg.png' 
import chinaTradi from '@/assets/chinatradi.png' 
import cholitaGala from '@/assets/cholitagala.png' 
import cholitaPa from '@/assets/cholitapa.png' 
import chinaInf from '@/assets/chinainf.png' 
import capoPlata from '@/assets/capoplata.png' 

function img(seed: string, alt: string) {
  return { url: `https://picsum.photos/seed/${seed}/900/1100`, alt }
}

// Venta: saleAvailable + salePrice (siempre mayor al rentalPrice). Los trajes sin esos campos son solo de alquiler.
export const costumes: Costume[] = [
  {
    id: 'TR-001',
    code: 'TR-001',
    name: 'Caporal Varón Tropa Clásico',
    category: 'Varon-Tropa',
    description:
      'Conjunto tradicional de tropa, confeccionado con bordado dorado y acabados en cuero. Pensado para grupos numerosos que buscan uniformidad y elegancia en cada presentación.',
    rentalPrice: 180,
    deposit: 300,
    saleAvailable: true,
    salePrice: 1800,
    availableSizes: ['S', 'M', 'L', 'XL'],
    pieceIds: getPiecesByCostume('TR-001').map((p) => p.id),
    images: [{ url: capo1, alt: 'Caporal Varón Tropa Clásico' }, { url: tr001b, alt: 'detalle bordado' }],
    status: 'Disponible',
    featured: true,
    rating: 4.8,
    totalRentals: 132,
  },
  {
    id: 'TR-002',
    code: 'TR-002',
    name: 'Caporal Varón Tropa Bordado Real',
    category: 'Varon-Tropa',
    description:
      'Versión superior con bordado en hilo metálico y faja tejida a mano. Incluye cascabeles de sonido profundo, ideal para entradas principales.',
    rentalPrice: 220,
    deposit: 350,
    availableSizes: ['M', 'L', 'XL'],
    pieceIds: getPiecesByCostume('TR-002').map((p) => p.id),
    images: [{ url: tr002a, alt: 'Caporal Varón Bordado Real' }],
    status: 'Disponible',
    rating: 4.9,
    totalRentals: 84,
  },
  {
    id: 'TR-003',
    code: 'TR-003',
    name: 'Macho Caporal Imperial',
    category: 'Macho-Caporal',
    description:
      'Diseño imponente con hombreras altas y detalles dorados. El traje insignia de la comparsa, reservado para quienes lideran la entrada.',
    rentalPrice: 350,
    deposit: 500,
    saleAvailable: true,
    salePrice: 3200,
    availableSizes: ['M', 'L', 'XL'],
    pieceIds: getPiecesByCostume('TR-003').map((p) => p.id),
    images: [{ url: capoImp, alt: 'Macho Caporal Imperial' }],
    status: 'Reservado',
    featured: true,
    rating: 5,
    totalRentals: 47,
  },
  {
    id: 'TR-004',
    code: 'TR-004',
    name: 'Macho Caporal Real',
    category: 'Macho-Caporal',
    description:
      'Versión de gala con capa corta bordada y botas altas. Un traje de exhibición para el bailarín principal del bloque.',
    rentalPrice: 380,
    deposit: 550,
    saleAvailable: true,
    salePrice: 3500,
    availableSizes: ['L', 'XL'],
    pieceIds: getPiecesByCostume('TR-004').map((p) => p.id),
    images: [{ url: capoImpReal, alt: 'Macho Caporal Real' }],
    status: 'Disponible',
    rating: 4.7,
    totalRentals: 39,
  },
  {
    id: 'TR-005',
    code: 'TR-005',
    name: 'China Supay Elegance',
    category: 'China-Supay',
    description:
      'Pollera amplia con bordado floral y blusa de encaje. Un conjunto femenino pensado para el movimiento y el brillo en escena.',
    rentalPrice: 200,
    deposit: 320,
    saleAvailable: true,
    salePrice: 1900,
    availableSizes: ['XS', 'S', 'M', 'L'],
    pieceIds: getPiecesByCostume('TR-005').map((p) => p.id),
    images: [{ url: chinaEleg, alt: 'China Supay Elegance' }],
    status: 'Disponible',
    featured: true,
    rating: 4.9,
    totalRentals: 156,
  },
  {
    id: 'TR-006',
    code: 'TR-006',
    name: 'China Supay Tradicional',
    category: 'China-Supay',
    description:
      'Interpretación clásica en tonos vino y dorado, con enaguas de tul y pañuelo bordado a mano.',
    rentalPrice: 190,
    deposit: 300,
    availableSizes: ['S', 'M', 'L'],
    pieceIds: getPiecesByCostume('TR-006').map((p) => p.id),
    images: [{ url: chinaTradi, alt: 'China Supay Tradicional' }],
    status: 'Alquilado',
    rating: 4.6,
    totalRentals: 98,
  },
  {
    id: 'TR-007',
    code: 'TR-007',
    name: 'Cholita de Gala',
    category: 'Cholita',
    description:
      'Pollera de fiesta con manta de seda y sombrero borsalino. Conjunto pensado para quienes representan la elegancia paceña.',
    rentalPrice: 210,
    deposit: 340,
    saleAvailable: true,
    salePrice: 2000,
    availableSizes: ['S', 'M', 'L', 'XL'],
    pieceIds: getPiecesByCostume('TR-007').map((p) => p.id),
    images: [{ url: cholitaGala, alt: 'Cholita de Gala' }],
    status: 'Disponible',
    rating: 4.8,
    totalRentals: 71,
  },
  {
    id: 'TR-008',
    code: 'TR-008',
    name: 'Cholita Paceña',
    category: 'Cholita',
    description:
      'Versión diaria de presentación con aguayo tejido y botines de cuero. Cómoda para jornadas largas de entrada.',
    rentalPrice: 170,
    deposit: 280,
    availableSizes: ['S', 'M', 'L'],
    pieceIds: getPiecesByCostume('TR-008').map((p) => p.id),
    images: [{ url: cholitaPa, alt: 'Cholita Paceña' }],
    status: 'Disponible',
    rating: 4.5,
    totalRentals: 63,
  },
  {
    id: 'TR-009',
    code: 'TR-009',
    name: 'Achachi Ceremonial',
    category: 'Achachi',
    description:
      'Máscara tallada a mano y poncho de lana gruesa. Un personaje central en las comparsas de tradición andina.',
    rentalPrice: 160,
    deposit: 260,
    availableSizes: ['M', 'L', 'XL'],
    pieceIds: getPiecesByCostume('TR-009').map((p) => p.id),
    images: [{ url: achachi, alt: 'Achachi Ceremonial' }],
    status: 'Reparacion',
    rating: 4.4,
    totalRentals: 22,
  },
  {
    id: 'TR-010',
    code: 'TR-010',
    name: 'Infantil Caporal Mini',
    category: 'Infantil',
    description:
      'Réplica a escala del traje de tropa, en telas suaves y ajuste elástico para los más pequeños del grupo.',
    rentalPrice: 90,
    deposit: 150,
    availableSizes: ['XS', 'S'],
    pieceIds: getPiecesByCostume('TR-010').map((p) => p.id),
    images: [{ url: infantecapo, alt: 'Infantil Caporal Mini' }],
    status: 'Disponible',
    rating: 4.9,
    totalRentals: 54,
  },
  {
    id: 'TR-011',
    code: 'TR-011',
    name: 'Infantil China Supay Mini',
    category: 'Infantil',
    description: 'Pollera corta y blusa bordada, pensada para la comodidad de las bailarinas más jóvenes.',
    rentalPrice: 85,
    deposit: 140,
    availableSizes: ['XS', 'S'],
    pieceIds: getPiecesByCostume('TR-011').map((p) => p.id),
    images: [{ url: chinaInf, alt: 'Infantil China Supay Mini' }],
    status: 'Disponible',
    rating: 4.7,
    totalRentals: 41,
  },
  {
    id: 'TR-012',
    code: 'TR-012',
    name: 'Macho Caporal Plata',
    category: 'Macho-Caporal',
    description: 'Bordado en tonos plateados sobre base negra, para quienes buscan un contraste distinto al dorado clásico.',
    rentalPrice: 360,
    deposit: 520,
    saleAvailable: true,
    salePrice: 3300,
    availableSizes: ['M', 'L'],
    pieceIds: getPiecesByCostume('TR-012').map((p) => p.id),
    images: [{ url: capoPlata, alt: 'Macho Caporal Plata' }],
    status: 'Disponible',
    rating: 4.6,
    totalRentals: 18,
  },
]

export function getCostumeById(id: string): Costume | undefined {
  return costumes.find((c) => c.id === id)
}