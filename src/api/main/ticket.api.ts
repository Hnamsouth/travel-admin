import { httpApi } from "../http.api";
import { BusSchedule } from "./route.api";
import { Users } from "./user.api";

export interface Pagination {
    current?: number;
    pageSize?: number;
    total?: number;
}
export interface TableData<d> {
    data: d[],
    pagination: Pagination;
}

export interface Tickets {
    "id": number,
    "name": string,
    "phone": string,
    "idBusSchedule": number,
    "status": number,
    "createAt": string,
    "departureDate": string,
    "email": string,
    "paypalOrderId": string,
    "price": number,
    "idBusScheduleNavigation": BusSchedule | null,
    "idUser": null,
    "idUserNavigation": Users | null,
    "ticketDetails": TicketDetail[] | []
}


export interface TicketDetail {
    "id": number,
    "ownerName": string,
    "ownerAge": number,
    "seat": string,
    "price": number,
    "idTicket": number,
    "idTicketNavigation": Tickets | null,
    "refundRequests": []
}

export const getTicketTableData = (pagination: Pagination): Promise<TableData<Tickets>> => {
    return new Promise((res) => {
        setTimeout(() => {
            res({
                data: [],
                pagination: { ...pagination, total: 20 },
            });
        }, 1000);
    });
};
