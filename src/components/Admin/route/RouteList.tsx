import React, { useState, useEffect, useCallback } from "react";
import { Popconfirm, Form, TablePaginationConfig, Space, Tooltip, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { Pagination } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BaseButtonsForm } from "@app/components/common/forms/BaseButtonsForm/BaseButtonsForm";
import { CreateRoute, EditRoute, Location, Route, getLocationTableData, getRouteTableData } from "@app/api/main/route.api";
import { AddRouteFormModal } from "./AddRouteFormModal";
import { EditRouteTableCell } from "./EditRouteTableCell";

const initialPagination: Pagination = {
    current: 1,
    pageSize: 20,
};

interface ItableData {
    data: Route[];
    pagination: Pagination;
    loading: boolean,
    location: Location[]
}

const Locations: React.FC = () => {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState<ItableData>({
        data: [],
        pagination: initialPagination,
        loading: false,
        location: []
    });
    const [editingKey, setEditingKey] = useState(0);
    const [visible, setVisible] = useState(false);

    const { t } = useTranslation();
    const { isMounted } = useMounted();


    const fetch = useCallback(
        (pagination: Pagination) => {
            setTableData((tableData) => ({ ...tableData, loading: true }));
            getRouteTableData(pagination).then((res) => {
                getLocationTableData(pagination).then((res1) => {
                    if (isMounted.current) {
                        setTableData({ data: res.data, pagination: res.pagination, loading: false, location: res1.data });
                    }
                })
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

    const create = async (data:Route)=>{
        const rs = await CreateRoute(data);
        if(rs){
            const updateData = [...tableData.data];
            rs['idFromLocationNavigation'] = tableData.location.find(e => e.id === rs.idFromLocation) as Location;
            rs['idToLocationNavigation'] = tableData.location.find(e => e.id === rs.idToLocation) as Location;
            updateData.push(rs);
            setTableData({ ...tableData, data: updateData })
            setVisible(false);
            message.success("Create Success");
        }else{
            message.success("Create Faild");
        }
    }

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields());
            console.log(row)
            const newData = [...tableData.data];
            const index = newData.findIndex((item) => key === item.id);
            if (index > -1) {
                const item = newData[index];
                row['id'] = item.id;
                const rs = await EditRoute(row);
                if (rs) {
                    row['idFromLocationNavigation'] = tableData.location.find(e => e.id === row.idFromLocation)
                    row['idToLocationNavigation'] = tableData.location.find(e => e.id === row.idToLocation)
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    setTableData({ ...tableData, data: newData });
                    setEditingKey(0);
                    message.success("Edit Success");
                }else{
                    message.error("Edit Faild");
                }
            } else {
                message.warning("Not Found");
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }

    const edit = (record: Partial<Route> & { id: React.Key }) => {
        form.setFieldsValue({ Name: '', ...record });
        form.setFieldValue('idFromLocation', record.idFromLocation);
        form.setFieldValue('idToLocation', record.idToLocation);
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

    const isEditing = (record: Route) => record.id === editingKey;

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            width: '5%',
            editable: false,
        },
        {
            title: t('common.route.from'),
            dataIndex: 'idFromLocation',
            width: '22%',
            editable: true,
            render: (text: string, record: Route) => {
                return (<>
                    <h4><strong>{record.idFromLocationNavigation?.name}</strong></h4>
                    <p>{record.idFromLocationNavigation?.addres}</p>
                </>)
            }
        },
        {
            title: t('common.route.to'),
            dataIndex: 'idToLocation',
            width: '22%',
            editable: true,
            render: (text: string, record: Route) => {
                return (<>
                    <h4><strong>{record.idToLocationNavigation?.name}</strong></h4>
                    <p>{record.idToLocationNavigation?.addres}</p>
                </>)
            }
        },
        {
            title: t('common.route.price'),
            dataIndex: 'price',
            width: '10%',
            editable: true,
            render: (text: string, record: Route) => record.price + t('common.money')
        },
        {
            title: t('common.route.distance'),
            dataIndex: 'distance',
            width: '10%',
            editable: true,
            render: (text: string, record: Route) => record.distance + "km"
        },
        {
            title: t('common.route.time'),
            dataIndex: 'time',
            width: '10%',
            editable: true,
            render: (text: string, record: Route) => ((record.time % 60) === 0 ? (record.time / 60) + "h" : (record.time / 60) > 0 ? Math.floor(record.time / 60) + "h" + (record.time % 60) + "m" : record.time + "m")
        },
        {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '20%',
            render: (text: string, record: Route) => {
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
            onCell: (record: Route) => ({
                record,
                inputType: col.dataIndex,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                location: tableData.location,
                form: form
            }),
        };
    });


    return (
        <>
            {/* create & edit modal */}
            <BaseButtonsForm.Provider
                onFormFinish={(name, { values, forms }) => {
                    // call api post data.
                    values['id']=0;
                    create(values as Route);
                }}

            >
                <Button type="default" style={{ "marginBottom": 15 + 'px' }} onClick={showFormModal}>
                    {t('common.create')}
                </Button>
                <AddRouteFormModal visible={visible} onCancel={hideFormModal} Location={tableData.location} />
            </BaseButtonsForm.Provider>


            {/* list &  delete in table */}
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditRouteTableCell,
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
export default Locations;
