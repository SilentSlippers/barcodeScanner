import { registerPlugin } from '@capacitor/core';

import type { SunmiBarcodeScannerPlugin } from './definitions';

const SunmiBarcodeScanner = registerPlugin<SunmiBarcodeScannerPlugin>(
  'SunmiBarcodeScanner',
  {
    web: () => import('./web').then(m => new m.SunmiBarcodeScannerWeb()),
  },
);

export * from './definitions';
export { SunmiBarcodeScanner };