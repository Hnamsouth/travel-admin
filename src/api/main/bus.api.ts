import { httpApi } from "../http.api";

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}
export interface TableData<d> {
  data: d[],
  pagination: Pagination;
}

export interface TypeBusRequest {
  name: string,
  pricePlus: number,
  img: string,
  publicId: string
}

export interface TypeBus_TypeSeat {
  "idTypeBus": number,
  "idTypeBusNavigation": TypeBus | null,
  "idTypeSeat": number,
  "idTypeSeatNavigation": TypeSeat | null
}

export interface TypeSeat {
  "id": number,
  "name": string,
}

export interface TypeBus {
  "id": number,
  "name": string,
  "pricePlus": number,
  "img": string,
  "publicId": string,
}

export interface BusStructure {
  "id": number,
  "row": number,
  "col": number,
  "idTypeBus": number,
  "idTypeBusNavigation": TypeBus | null,
}
export interface SeatStructure {
  "id": number,
  "rowIndex": number,
  "colIndex": number,
  "idBusStructure": number,
  "idBusStructureNavigation": BusStructure | null,
  "idTypeSeat": number,
  "idTypeSeatNavigation": TypeSeat | null
}

export interface Buss {
  "id": number,
  "number": number,
  "status": number,
  "idTypeBus": number,
  "idTypeBusNavigation": TypeBus | null
}

export interface BusCreate {
  "number": number,
  "status": number,
  "idTypeBus": number,
}
export interface DeleteType {
  name: "type-seat" | "type-bus" | "bus-list" | "bus-stt" | "seat-stt" | "tb-ts",
  id: number
}









export const getTypeSeatTableData = async (pagination: Pagination): Promise<TableData<TypeSeat>> => {
  const rs = await httpApi.get<TypeSeat[]>('bus/get-data?type=type-seat');
  return new Promise((res) => res({ data: rs.data, pagination: { ...pagination, total: 16 }, }));
};

export const getSeatStructureTableData = async (pagination: Pagination): Promise<TableData<SeatStructure>> => {
  const rs = await httpApi.get<SeatStructure[]>('bus/get-data?type=seat-stt');
  return new Promise((res) => res({ data: rs.data, pagination: { ...pagination, total: 16 }, }));
};
/// seat structure
export const getSeatStructureData = (pagination: Pagination): Promise<TableData<SeatStructure>> => {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: [],
        pagination: { ...pagination, total: 16 },
      });
    }, 100);
  });
};
export const CreateSeatStructure =  async (data: SeatStructure[]): Promise<any> => await httpApi.post("bus/seat-stt-create", data).then((res) => res.data);


export const getTypeBusTypeSeatData = async (pagination: Pagination): Promise<TableData<TypeBus_TypeSeat>> => {
  const rs = await httpApi.get<TypeBus_TypeSeat[]>('bus/get-data?type=tb-ts');
  return new Promise((res) => res({ data: rs.data, pagination: { ...pagination, total: 16 }, }));
};

/// bus structure
export const getBusStructureTableData = async (pagination: Pagination): Promise<TableData<BusStructure>> => {
  const rs = await httpApi.get<BusStructure[]>('bus/get-data?type=bus-stt');
  return new Promise((res) => res({ data: rs.data, pagination: { ...pagination, total: 16 }, }));
};

export const CreateBusStructure = async (data: BusStructure): Promise<BusStructure> => await httpApi.post("bus/bus-stt-create", data).then((res) => res.data);
export const EditBusStructure = async (data: BusStructure): Promise<boolean> => await httpApi.put("bus/bus-stt-edit", data).then((res) => res.data);


/// bus list
export const getBusesTableData = async (pagination: Pagination): Promise<TableData<Buss>> => {
  const rs = await httpApi.get<Buss[]>('bus/get-data?type=bus-list');
  return new Promise((res) => res({ data: rs.data, pagination: { ...pagination, total: 16 }, }));
};
export const CreateBus = async (data: BusCreate): Promise<Buss> => await httpApi.post("bus/create", data).then((res) => res.data);
export const EditBus = async (data: Buss): Promise<boolean> => await httpApi.put("bus/edit", data).then((res) => res.data);

/// type bus
export const getTypeBusTableData = async (pagination: Pagination): Promise<TableData<TypeBus>> => {
  const rs = await httpApi.get<TypeBus[]>('bus/get-data?type=type-bus');
  return new Promise((res) => res({ data: rs.data, pagination: { ...pagination, total: 16 } }));
};
export const CreateTypeBus = async (data: TypeBusRequest): Promise<any> => await httpApi.post<any>('type-bus/create', data).then((res) => res.data).catch((err) => err);
export const EditTypeBus = async (data: TypeBus): Promise<TypeBus> => await httpApi.put("type-bus/edit", data).then((res) => res.data);

export const removeimg = async (publicId: string): Promise<any> => await httpApi.post<any>("type-bus/remove-img?publicId=" + publicId).then((res) => res.data);
export const DeleteBusData = async (data: DeleteType): Promise<boolean> => await httpApi.post("bus/delete-data", data).then((res) => res.data);



