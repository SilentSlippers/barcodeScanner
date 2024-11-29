import { WebPlugin } from '@capacitor/core';

import type { PermissionStatus, ScanParams, SunmiBarcodeScannerPlugin } from './definitions';

export class SunmiBarcodeScannerWeb
  extends WebPlugin
  implements SunmiBarcodeScannerPlugin
{
    startScan(options?: ScanParams | undefined): Promise<{ result: { format: string; content: string; }[]; }> {
        throw new Error('Method not implemented.');
    }
    stopScan(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    checkPermission(): Promise<PermissionStatus> {
        throw new Error('Method not implemented.');
    }
}