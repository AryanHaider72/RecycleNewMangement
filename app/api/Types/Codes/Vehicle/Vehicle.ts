export interface responseVehicleListGet {
  message: string;
  error: string;
  dataList: VehicleList[];
}

export interface VehicleAddRequest {
  vehicleNo: string;
  openingMeterReading: number;
  positiveThreshold: number;
  scrapCarryThreshold: number;
  scrapRatePerKG: number;
  bottleRatePerPcs: number;
  openingInvestment: number;
  ownerShip: string;
  description: string;
}

export interface VehicleList {
  vehicleID: string;
  vehicleNo: string;
  openingMeterReading: number;
  positiveThreshold: number;
  scrapCarryThreshold: number;
  scrapRatePerKG: number;
  bottleRatePerPcs: number;
  openingInvestment: number;
  ownerShip: string;
  description: string;
}
