import React, { useState, useEffect, useCallback } from "react";
import { Popconfirm, Form, TablePaginationConfig, Space, Col, TableColumnsType, Badge } from 'antd';
import { Table } from 'components/common/Table/Table';
import { Pagination } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { Buss, getBusesTableData } from "@app/api/main/bus.api";
import { BaseButtonsForm } from "@app/components/common/forms/BaseButtonsForm/BaseButtonsForm";


import { Route, getBusScheduleTableData, getRouteTableData } from "@app/api/main/route.api";
import dayjs from "dayjs";
import { ArrowRightOutlined } from '@ant-design/icons';
import { DayjsDatePicker } from "@app/components/common/pickers/DayjsDatePicker";
import { Priority } from "@app/constants/enums/priorities";
import { Status } from "@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status";
import { defineColorByPriority } from "@app/utils/utils";
import { ColumnsType } from "antd/lib/table";
import { TicketDetail, Tickets, getTicketTableData } from "@app/api/main/ticket.api";

const initialPagination: Pagination = {
    current: 1,
    pageSize: 20,
};
interface ItableData {
    data: Tickets[];
    pagination: Pagination;
    loading: boolean
}
interface ExpandedDataType {
    key: React.Key;
    date: string;
    name: string;
    upgradeNum: string;
  }


const TicketList: React.FC = () => {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState<ItableData>({
        data: [],
        pagination: initialPagination,
        loading: false
    });
    const dpk = <DayjsDatePicker />;
    const [editingKey, setEditingKey] = useState(0);
    const [visible, setVisible] = useState(false);

    const { t } = useTranslation();
    const { isMounted } = useMounted();
    const Statuss = [ // pending:0 -- running:1 -- finished:2 -- cancel:3
        {
            id: 0, title: t('tables.busList.status.pending')
        },
        {
            id: 1, title: t('tables.busList.status.running')
        },
        {
            id: 2, title: t('tables.busList.status.finished')
        },
        {
            id: 3, title: t('tables.busList.status.cancel')
        },
    ]

    const fetch = useCallback(
        (pagination: Pagination) => {
            setTableData((tableData) => ({ ...tableData, loading: true }));
            getTicketTableData(pagination).then((res) => {
                if (isMounted.current) {
                    setTableData({ data: res.data, pagination: res.pagination, loading: false});
                }
            });
        },
        [isMounted],
    );

    useEffect(() => {
        fetch(initialPagination);
    }, [fetch]);

    const showFormModal = () => {
        console.log("show modal")
        setVisible(true);
    };

    const hideFormModal = () => {
        setVisible(false);
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields());
            console.log(row)
            const newData = [...tableData.data];
            const index = newData.findIndex((item) => key === item.id);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                console.log(row)
            } else {
                newData.push(row);
            }
            setTableData({ ...tableData, data: newData });
            setEditingKey(0);
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }

    const edit = (record: Partial<Tickets> & { id: React.Key }) => {
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

    const handleDeleteRow = (rowId: number) => {
        setTableData({ ...tableData, data: tableData.data.filter((item) => item.id !== rowId) });
    };

    const isEditing = (record: Tickets) => record.id === editingKey;

    const expandedRowRender = () => {
        const columns: TableColumnsType<ExpandedDataType> = [
            { title: 'Date', dataIndex: 'date', key: 'date' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
                title: 'Status',
                key: 'state',
                render: () => <Badge status="success" text="Finished" />,
            },
            { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
            {
                title: 'Action',
                dataIndex: 'operation',
                key: 'operation',
                render: () => (
                    <Space size="middle">
                        <a>Pause</a>
                        <a>Stop</a>
                 
                    </Space>
                ),
            },
        ];

        const data = [];
        for (let i = 0; i < 3; ++i) {
            data.push({
                key: i.toString(),
                date: '2014-12-24 23:12:00',
                name: 'This is production name',
                upgradeNum: 'Upgraded: 56',
            });
        }
        return <Table columns={columns} dataSource={data} pagination={false} />;
    }


    const columns: ColumnsType<Tickets> = [
        {
            title: 'id',
            dataIndex: 'id',
            width: '5%',
        },
        {
            title: t('common.ticket.phone'),
            dataIndex: 'phone',
            width: '10%',
            key: 'phone',
        },
        {
            title: t('common.ticket.name'),
            dataIndex: 'name',
            width: '10%',
            key: 'name',
        },
        {
            title: t('common.ticket.user'),
            dataIndex: 'user',
            width: '10%',
            key: 'user',
            render:(value:string, record:Tickets )=>record.idUserNavigation?.idUserInfoNavigation?.name,
        },
        {
            title: t('common.busSchedule'),
            dataIndex: 'idBusSchedule',
            width: '20%',
            key: 'idBusSchedule',
            render:(value:string, record:Tickets )=>{
                return (
                    <> 
                    {/* {record.idBusScheduleNavigation.} <ArrowRightOutlined/>  {record.Bus_Schedule.route.to.name}
                        <p>{record.Bus_Schedule.date} - {record.Bus_Schedule.time}</p> */}
                    </>
                );
            }
        },
        {
            title: t('tables.busList.status.title'),
            dataIndex: 'status',
            width: '10%',
            key: 'status',
            render: (text: string, record: Tickets) => {
                //pending:0 -- running:1 -- finished:2 -- cancel:3
                let check = record.status === 0 ? Priority.INFO : record.status === 1 ? Priority.MEDIUM : record.status === 2 ? Priority.LOW : Priority.HIGH;
                return (
                    <Col key={"tag" + record.id}>
                        <Status color={defineColorByPriority(check)} text={Statuss.find(e => e.id === record.status)?.title.toUpperCase() as string} />
                    </Col>
                )
            }
        },
        {
            title: t('common.ticket.createdAt'),
            dataIndex: 'created_at',
            width: '10%',
            key: 'Phone',
        },
        {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '20%',
            key: 'Phone',
            render: (text: string, record: Tickets) => {
                const editable = isEditing(record);
                return (
                    <Space>
                        {editable ? (
                            <>
                                <Popconfirm title={t('tables.cancelInfo')} onConfirm={() => save(record.id)} >
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

    // render: (text: string, record: Tickets) => {
    //     //pending:0 -- running:1 -- finished:2 -- cancel:3
    //     let check = record.Status === 0 ? Priority.INFO : record.Status === 1 ? Priority.MEDIUM : record.Status === 2 ? Priority.LOW : Priority.HIGH;
    //     return (
    //         <Col key={"tag" + record.id}>
    //             <Status color={defineColorByPriority(check)} text={Statuss.find(e => e.id === record.Status)?.title.toUpperCase() as string} />
    //         </Col>
    //     )
    // }

    return (
        <>
            {/* create & edit modal */}
            <BaseButtonsForm.Provider
                onFormFinish={(name, { values, forms }) => {
                    // call api post data.
                    let newData = { ...values } as Tickets;
                    const updateData = [...tableData.data];
                    newData['id'] = Math.floor(Math.random() * 100) + 5;
                    updateData.push(newData);
                    setTableData({ ...tableData, data: updateData })
                    setVisible(false);
                }}
            >
                <Button type="default" style={{ "marginBottom": 15 + 'px' }} onClick={showFormModal}>
                    {t('common.create')}
                </Button>
                {/* <AddScheduleFormModal visible={visible} onCancel={hideFormModal} Route={tableData.RouteList} Bus={tableData.BusList} Status={Statuss} /> */}
            </BaseButtonsForm.Provider>
            {/* list &  delete in table */}
            <Form form={form} component={false}>
                <Table
                    bordered
                    dataSource={tableData.data}
                    columns={columns}
                    expandable={{ expandedRowRender }}
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
export default TicketList;
