/**
 * Loaders de los componentes de Page Designer de la Home (patrón del template: `product-tile/loaders.ts`).
 * Los componentes no importan `*.server` directamente: el build de producción lo prohíbe en el grafo del cliente.
 */
export { loadHeroBlock, loadProfileBlock, visibleFor } from '@/extensions/pj-home/lib/home-data.server';
export type { ProfileGate } from '@/extensions/pj-home/lib/home-data.server';
