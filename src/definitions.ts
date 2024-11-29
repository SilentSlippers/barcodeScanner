import type { PermissionState, PluginListenerHandle } from '@capacitor/core';

export interface Barcode {
    /**
     * Raw bytes as it was encoded in the barcode.
     *
     * @since 0.0.1
     * @example [67, 97, 112, 97, 99, 105, 116, 111, 114, 74, 83]
     */
    bytes?: number[];
    /**
     * The four corner points of the barcode in clockwise
     * order starting with top-left.
     *
     * This property is currently only supported by the `startScan(...)` method.
     *
     * @since 0.0.1
     * @example [[34, 33], [264, 32], [263, 263], [33, 263]]
     * @experimental This property is experimental and may change in the future.
     */
    cornerPoints?: [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ];
    /**
     * The barcode value in a human readable format.
     *
     * @since 0.0.1
     * @example "CapacitorJS"
     */
    displayValue: string;
    /**
     * The barcode format.
     *
     * @since 0.0.1
     * @example "QR_CODE"
     */
    format: Symbologies;
    /**
     * The barcode value in a machine readable format.
     *
     * @since 0.0.1
     * @example "CapacitorJS"
     */
    rawValue: string;
}
export interface Symbologies {
    /**
     * Allow to read the EAN-8 barcode
     *
     * @default false
     * @see IS_EAN_8_ENABLE
     */
    ean_8?: boolean;
  
    /**
     * Allow to read the UPC-E barcode
     *
     * @default false
     * @see IS_UPC_E_ENABLE
     */
    upc_e?: boolean;
  
    /**
     * Allow to read the ISBN-10 (from EAN-13) barcode
     *
     * @default false
     * @see IS_ISBN_10_ENABLE
     */
    isbn_10?: boolean;
  
    /**
     * Allow to read the CODE-11 barcode
     *
     * @default false
     * @see IS_CODE_11_ENABLE
     */
    code_11?: boolean;
  
    /**
     * Allow to read the UPC-A barcode
     *
     * @default false
     * @see IS_UPC_A_ENABLE
     */
    upc_a?: boolean;
  
    /**
     * Allow to read the AN-13 barcode
     *
     * @default false
     * @see IS_EAN_13_ENABLE
     */
    ean_13?: boolean;
  
    /**
     * Allow to read the ISBN-13 (from EAN-13) barcode
     *
     * @default false
     * @see IS_ISBN_13_ENABLE
     */
    isbn_13?: boolean;
  
    /**
     * Allow to read the Interleaved 2 of 5 barcode
     *
     * @default false
     * @see IS_INTERLEAVED_2_OF_5_ENABLE
     */
    interleaved_2_of_5?: boolean;
  
    /**
     * Allow to read the ECode 128 barcode
     *
     * @default false
     * @see IS_CODE_128_ENABLE
     */
    code_128?: boolean;
  
    /**
     * Allow to read the Codabar barcode
     *
     * @default false
     * @see IS_CODABAR_ENABLE
     */
    codabar?: boolean;
  
    /**
     * Allow to read the Code 39 barcode
     *
     * @default false
     * @see IS_CODE_39_ENABLE
     */
    code_39?: boolean;
  
    /**
     * Allow to read the Code 93 barcode
     *
     * @default false
     * @see IS_CODE_93_ENABLE
     */
    code_93?: boolean;
  
    /**
     * Allow to read the DataBar (RSS-14) barcode
     *
     * @default false
     * @see IS_DATABAR_ENABLE
     */
    databar?: boolean;
  
    /**
     * Allow to read the DataBar Expanded barcode
     *
     * @default false
     * @see IS_DATABAR_EXP_ENABLE
     */
    databar_exp?: boolean;
  
    /**
     * Allow to read the Micro PDF417 barcode
     *
     * @default false
     * @see IS_Micro_PDF417_ENABLE
     */
    micro_pdf417?: boolean;
  
    /**
     * Allow to read the Micro QR Code barcode
     *
     * @default false
     * @see IS_MicroQR_ENABLE
     */
    microqr?: boolean;
  
    /**
     * Allow to read the QR code
     *
     * @default false
     * @see IS_QR_CODE_ENABLE
     */
    qr_code?: boolean;
  
    /**
     * Allow to read the PDF417 barcode
     *
     * @default false
     * @see IS_PDF417_ENABLE
     */
    pdf417?: boolean;
  
    /**
     * Allow to read the DataMatrix code
     *
     * @default false
     * @see IS_DATA_MATRIX_ENABLE
     */
    data_matrix?: boolean;
  
    /**
     * Allow to read the AZTEC code
     *
     * @default false
     * @see IS_AZTEC_ENABLE
     */
    aztec?: boolean;
  
    /**
     * Allow to read the Hanxin code
     *
     * @default false
     * @see IS_Hanxin_ENABLE
     */
    hanxin?: boolean;
}
export interface ScanParams {
    /**
     * Sound prompt after scan completes
     *
     * @default true
     * @see PLAY_SOUND
     */
    play_sound?: boolean;
  
    /**
     * Vibrate when scan completes. At present, M1 hardware supports this configuration for vibration, while V1 does not support.
     *
     * @default false
     * @see PLAY_VIBRATE
     */
    play_vibrate?: boolean;
  
    /**
     * Whether to display the Settings button in the upper right corner
     *
     * @default false
     * @see IS_SHOW_SETTING
     */
    show_setting?: boolean;
  
    /**
     * Whether to display the button "select picture from album"
     *
     * @default false
     * @see IS_SHOW_ALBUM
     */
    show_album_selector?: boolean;
  
    /**
     * Whether to display the flashlight
     *
     * @default false
     * @see IS_OPEN_LIGHT
     */
    show_flashlight?: boolean;
  
    /**
     * Recognize multiple QR codes in the image
     *
     * @default false
     * @see IDENTIFY_MORE_CODE
     */
    recognize_multiple_codes?: boolean;
  
    /**
     * Allow to read the reverse color QR code
     *
     * @default false
     * @see IDENTIFY_INVERSE
     */
    recognize_inverse_codes?: boolean;
  
    /**
     * Whether cycle mode
     *
     * @default false
     * @see SCAN_MODE
     */
    scan_mode?: boolean;
  
    /**
     * Symbologies configuration
     */
    symbologies?: Symbologies;
}
export interface PermissionStatus{
    camera: CameraPermissionState;
}
export interface BarcodeScannedEvent {
    /**
     * A detected barcode.
     *
     * @since 0.0.1
     */
    barcode: Barcode;
}
export interface ScanErrorEvent {
    /**
     * The error message.
     *
     * @since 0.0.1
     */
    message: string;
}


export type CameraPermissionState = PermissionState;

export interface SunmiBarcodeScannerPlugin {
    
    startScan(options?: ScanParams): Promise<{ result: { format: string, content: string }[] }>;
    
    stopScan(): Promise<void>;
    
    checkPermission(): Promise<PermissionStatus>;
    
    addListener(
        eventName: 'barcodeScanned',
        listenerFunc: (event: BarcodeScannedEvent) => void,
      ): Promise<PluginListenerHandle>;
    
    addListener(
        eventName: 'scanError',
        listenerFunc: (event: ScanErrorEvent) => void,
      ): Promise<PluginListenerHandle>;
    
}