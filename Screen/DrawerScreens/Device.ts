
export enum DeviceType {
  slidingWindow = 0,
}

export interface WindowState {
  openPercent: number;
}

export class Device {
  id: number;
  macAddress: string;
  type: DeviceType;
  state: WindowState;
  // name: string;

  constructor({ id, macAddress, type, state }: Device) {
    this.id = id;
    this.macAddress = macAddress;
    this.type = type;
    this.state = state;
    // this.name = name;
  }
}