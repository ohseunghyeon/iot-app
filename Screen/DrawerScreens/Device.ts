
export enum DeviceType {
  slidingWindow = 0,
}

export class Device {
  id: number;
  macAddress: string;
  type: DeviceType;
  // name: string;

  constructor(id: number, macAddress: string, type: number) {
    this.id = id;
    this.macAddress = macAddress;
    this.type = type;
    // this.name = name;
  }
}