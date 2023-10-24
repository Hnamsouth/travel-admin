import React, { useState, useEffect, useCallback } from "react";
import { Popconfirm, Form, TablePaginationConfig, Space } from 'antd';
import { Table } from 'components/common/Table/Table';
import { Pagination } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import {  getSeatStructureTableData, SeatStructure, TypeBus_TypeSeat, BusStructure, getTypeBusTypeSeatData } from "@app/api/main/bus.api";
import { BaseButtonsForm } from "@app/components/common/forms/BaseButtonsForm/BaseButtonsForm";

import { EditSeatStructureTableCell } from "./EditSeatStructureTableCell";
import { AddSeatStructureFormModal } from "../AddSeatStructureFormModal";
import { useLocation } from "react-router-dom";


const initialPagination: Pagination = {
    current: 1,
    pageSize: 20,
};
export interface IcreateData{
    Bus_Structrue:BusStructure,
    Typebus_Typeseat:TypeBus_TypeSeat[]
}

interface ItableData { 
    data: SeatStructure[],
    pagination: Pagination,
    loading: boolean,
    createData:IcreateData
}

const SeatStructureComponent: React.FC = () => {
    const [form] = Form.useForm();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const busSttid = parseInt(searchParams.get('busSttid') as string);

    const [tableData, setTableData] = useState<ItableData>({
        data: [],
        pagination: initialPagination,
        loading: false,
        createData:{
            Bus_Structrue: {} as BusStructure ,
            Typebus_Typeseat: []
        }
    });
    const [editingKey, setEditingKey] = useState(0);

    const [visible, setVisible] = useState(false);

    const { t } = useTranslation();
    const { isMounted } = useMounted();


    const fetch = useCallback(
        (pagination: Pagination) => {
            setTableData((tableData) => ({ ...tableData, loading: true}));
            getSeatStructureTableData(pagination).then((res) => {
                    if(busSttid){
                        getTypeBusTypeSeatData(pagination).then((res2)=>{
                            if (isMounted.current) {
                                console.log(res,res2)
                                let busStt = res.data.find(e=>e.idBusStructure===busSttid)?.idBusStructureNavigation as BusStructure;
                                let Cdata:IcreateData = {
                                    Bus_Structrue: busStt,
                                    Typebus_Typeseat: res2.data.filter(e=>e.idTypeBus===busStt.id)
                                }
                                setTableData({ data: res.data, pagination: res.pagination, loading: false,createData:Cdata });
                            }
                        })
                    setTableData({...tableData, data: res.data, pagination: res.pagination, loading: false });
                    setVisible(true);
                }
            });
            console.log(tableData.createData)
        },
        [isMounted],
    );

    useEffect(() => {
        fetch(initialPagination);
    }, [fetch]);

    const showFormModal = () => {
        setVisible(true);
    };

    const hideFormModal = () => {
        setVisible(false);
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields());
            const newData = [...tableData.data];
            const index = newData.findIndex((item) => key === item.id);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
            } else {
                newData.push(row);
            }
            setTableData({ ...tableData, data: newData });
            setEditingKey(0);
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }

    const edit = (record: Partial<SeatStructure> & { id: React.Key }) => {
        form.setFieldsValue({ Name: '', ...record });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey(0);
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        fetch(pagination);
        cancel();
    };

    const handleDeleteRow = (rowid: number) => {
        setTableData({ ...tableData, data: tableData.data.filter((item) => item.id !== rowid) });
    };

    const isEditing = (record: SeatStructure) => record.id === editingKey;

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            width: '5%',
            editable: false,
            key:'id'
        },
        {
            title: t('tables.typeSeat.name'),
            dataIndex: 'Name',
            width: '20%',
            editable: true,
        },
        {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '20%',
            render: (text: string, record: SeatStructure) => {
                const editable = isEditing(record);
                return (
                    <Space>
                        {editable ? (
                            <>
                                <Popconfirm title={t('tables.cancelInfo')} onConfirm={() => save(record.id)}>
                                    <Button type="primary"  >
                                        {t('common.save')}
                                    </Button>
                                </Popconfirm>
                                <Popconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                                    <Button type="ghost">{t('common.cancel')}</Button>
                                </Popconfirm>
                            </>
                        ) : (
                            <>
                                <Button type="ghost" disabled={editingKey !== 0} onClick={() => edit(record)}>
                                    {t('common.edit')}
                                </Button>
                                <Button type="default" disabled={editingKey !== 0} danger onClick={() => handleDeleteRow(record.id)}>
                                    {t('tables.delete')}
                                </Button>
                            </>
                        )}
                    </Space>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: SeatStructure) => ({
                record,
                inputType: col.dataIndex,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    return (
        <>
            {/* create & edit modal */}
            <BaseButtonsForm.Provider
                onFormFinish={(name, { values, forms }) => {
                    // call api post data.
                    console.log(values)
                    setVisible(false);
                }}
            >
                <Button type="default" style={{ "marginBottom": 15 + 'px' }} onClick={showFormModal}>
                    {t('common.create')}
                </Button>
                <AddSeatStructureFormModal visible={visible} onCancel={hideFormModal} setUpCreate={tableData.createData}/>
            </BaseButtonsForm.Provider>


            {/* list &  delete in table */}
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditSeatStructureTableCell,
                        },
                    }}
                    bordered
                    dataSource={tableData.data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        ...tableData.pagination,
                        onChange: cancel,
                    }}
                    onChange={handleTableChange}
                    loading={tableData.loading}
                    scroll={{ x: 800 }}
                />
            </Form>
        </>
    )
}
export default SeatStructureComponent;
