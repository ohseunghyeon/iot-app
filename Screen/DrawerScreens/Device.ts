
export enum DeviceType {
  slidingWindow = 0,
}

export interface WindowState {
  openPercent: number;
}

export interface WindowMeta {
  name: string;
}

export class Device {
  id: number;
  macAddress: string;
  type: DeviceType;
  state: WindowState;
  meta: WindowMeta;
  // name: string;

  constructor({ id, macAddress, type, state, meta }: Device) {
    this.id = id;
    this.macAddress = macAddress;
    this.type = type;
    this.state = state;
    this.meta = meta;
  }
}