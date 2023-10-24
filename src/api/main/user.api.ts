import { httpApi } from "../http.api";
import { Tickets } from "./ticket.api";

export interface Pagination {
    current?: number;
    pageSize?: number;
    total?: number;
}
export interface TableData<d> {
    data: d[],
    pagination: Pagination;
}

export interface UserInfo {
    "id": number,
    "name": string,
    "phone": string,
    "address": string | null,
    "doB": string,
    "gender": boolean,
    "users": Users[] | []
}

export interface Users {
    "id": number,
    "email": string,
    "password": string,
    "idUserInfo": number,
    "activate": true,
    "token": string,
    "idUserInfoNavigation": UserInfo | null,
    "admins": Admins[] | [],
    "tickets": Tickets[] | []
}

export interface Admins {
    id: number,
    role: string,
    "idUser": null,
    "idUserNavigation": Users | null,
}

const getTicketTableData = (pagination: Pagination): Promise<TableData<Users>> => {
    return new Promise((res) => {
        setTimeout(() => {
            res({
                data: [],
                pagination: { ...pagination, total: 20 },
            });
        }, 1000);
    });
};