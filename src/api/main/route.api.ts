import { httpApi } from "../http.api";
import { Buss } from "./bus.api";

export interface Pagination {
    current?: number;
    pageSize?: number;
    total?: number;
}

export interface TableData<d> {
    data: d[],
    pagination: Pagination;
}


export interface Location {
    "id": number,
    "name": string,
    "lat": string,
    "lng": string,
    "area": string,
    "addres": string,
}

export interface Route {
    "id": number,
    "distance": number,
    "time": number,
    "price": number,
    "idFromLocation": number,
    "idToLocation": number,
    "idFromLocationNavigation": Location | null,
    "idToLocationNavigation": Location | null,
}

export interface BusSchedule {
    "id": number,
    "idBus": number,
    "status": number,
    "dayOfWeek": number,
    "idBusNavigation": Buss | null,
    "travelRoutes":TravelRoute[] | []

}
export interface SpecialSchedules {
    "id": number,
    "date": string,
    "idBus": number,
    "title": string,
    "description": string,
    "idBusNavigation": Buss | null,
}
export interface TravelRoute {
    "id": number,
    "timeStart": string,
    "idRoute": number,
    "idBusSchedule": number,
    "idSpecialSchedule": number| null,
    "idBusScheduleNavigation": BusSchedule | null,
    "idRouteNavigation": Route | null,
    "idSpecialScheduleNavigation": SpecialSchedules | null
}
interface DeleteType {
    name:"route"|"schedule"|"travel-route"|"special-schedule",
    id:number
}
/// location
export const getLocationTableData = async (pagination: Pagination): Promise<TableData<Location>> => {
    const rs = await httpApi.get<Location[]>('route/get-data?type=location');
    return new Promise((res) => res({ data: rs.data, pagination: { ...pagination, total: 16 }, }));
};
export const CreateLocation = async (data: Location): Promise<Location> => await httpApi.post("route/create-location", data).then((res) => res.data);
export const EditLocation= async (data: Location): Promise<boolean> => await httpApi.put("route/edit-location", data).then((res) => res.data);

/// route
export const getRouteTableData = async (pagination: Pagination): Promise<TableData<Route>> => {
    const rs = await httpApi.get<Route[]>('route/get-data?type=route');
    return new Promise((res) => res({ data: rs.data, pagination: { ...pagination, total: 16 }, }));
};
export const CreateRoute = async (data: Route): Promise<Route> => await httpApi.post("route/create", data).then((res) => res.data);
export const EditRoute= async (data: Route): Promise<boolean> => await httpApi.put("route/edit", data).then((res) => res.data);

/// schedule
export const getBusScheduleTableData = async (pagination: Pagination): Promise<TableData<BusSchedule>> => {
    const rs = await httpApi.get<BusSchedule[]>('route/get-data?type=schedule');
    return new Promise((res) => res({ data: rs.data, pagination: { ...pagination, total: 16 }, }));
};

export const CreateBusSchedule = async (data: BusSchedule): Promise<BusSchedule> => await httpApi.post<BusSchedule>("route/create-bus-schedule", data).then((res) => res.data);
export const EditBusSchedule= async (data: BusSchedule): Promise<boolean> => await httpApi.put("route/edit-bus-schedule", data).then((res) => res.data);

/// travel route

export const  getTravelRouteTableData = async (pagination: Pagination): Promise<TableData<TravelRoute>> => {
    const rs = await httpApi.get<TravelRoute[]>('route/get-data?type=travel-route');
    return new Promise((res) => res({ data: rs.data, pagination: { ...pagination, total: 16 }, }));
}; 

export const CreateTravelRoute = async (data: TravelRoute): Promise<TravelRoute> => await httpApi.post<TravelRoute>("route/create-travel-route", data).then((res) => res.data);
export const EditTravelRoute= async (data: TravelRoute): Promise<boolean> => await httpApi.put("route/edit-travel-route", data).then((res) => res.data);