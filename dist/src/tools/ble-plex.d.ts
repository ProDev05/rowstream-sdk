export declare type TransactionId = string;
export declare type DeviceId = string;
export declare type Base64 = string;
export declare type UUID = string;
export declare type RefreshGattMoment = any;
export declare type BleError = any;
export declare type Characteristic = any;
export declare type Service = any;
export interface Subscription {
    remove: () => void;
}
export declare enum ConnectionPriority {
    Balanced = "Balanced",
    High = "High",
    LowPower = "LowPower"
}
export interface ConnectionOptions {
    autoConnect?: boolean;
    requestMTU?: number;
    refreshGatt?: RefreshGattMoment;
    timeout?: number;
}
export interface Device {
    id: DeviceId;
    name?: string;
    rssi?: string;
    mtu: number;
    manufacturerData?: Base64;
    serviceData?: {
        [serviceUUID: string]: any;
    };
    serviceUUIDs?: UUID[];
    localName?: string;
    txPowerLevel?: number;
    solicitedServiceUUIDs?: UUID[];
    isConnectable?: boolean;
    overflowServiceIds?: UUID[];
    requestConnectionPriority: (connectionPriority: ConnectionPriority, transactionId?: TransactionId) => Promise<Device>;
    readRSSI: (transactionId?: TransactionId) => Promise<Device>;
    requestMTU: (mtu: number, transactionId?: TransactionId) => Promise<Device>;
    connect: (options?: ConnectionOptions) => Promise<Device>;
    cancelConnection: () => Promise<Device>;
    isConnected: () => Promise<boolean>;
    onDisconnected: (listener: (error: BleError | undefined, device: Device) => any) => Subscription;
    discoverAllServicesAndCharacteristics: (transactionId?: TransactionId) => Promise<Device>;
    services: () => Promise<Service[]>;
    characteristicsForService: (serviceUUID: UUID) => Promise<Characteristic[]>;
    readCharacteristicForService: (serviceUUID: UUID, characteristicUUID: UUID, transactionId?: TransactionId) => Promise<Characteristic>;
    writeCharacteristicWithResponseForService: (serviceUUID: UUID, characteristicUUID: UUID, valueBase64: Base64, transactionId?: TransactionId) => Promise<Characteristic>;
    writeCharacteristicWithoutResponseForService: (serviceUUID: UUID, characteristicUUID: UUID, valueBase64: Base64, transactionId?: TransactionId) => Promise<Characteristic>;
    monitorCharacteristicForService: (serviceUUID: UUID, characteristicUUID: UUID, listener: (error?: BleError, characteristic?: Characteristic) => any, transactionId?: TransactionId) => Subscription;
}
