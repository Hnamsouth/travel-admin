import React, { useState, useEffect, useCallback } from "react";
import { Popconfirm, Form, TablePaginationConfig, Space, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { Pagination } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BusStructure, TypeBus, getBusStructureTableData, getTypeBusTableData, getSeatStructureTableData, SeatStructure, DeleteBusData, EditBusStructure, CreateBusStructure, TypeBus_TypeSeat, getTypeBusTypeSeatData, CreateSeatStructure } from "@app/api/main/bus.api";
import { EditBusStructrueTableCell } from "./EditBusStructureTableCell";
import { BaseButtonsForm } from "@app/components/common/forms/BaseButtonsForm/BaseButtonsForm";
import { AddBusStructureFormModal } from "./AddBusStructureFormModal";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AddSeatStructureFormModal } from "./AddSeatStructureFormModal";

export interface ISTTData {
  Bus_Structrue: BusStructure,
  Typebus_Typeseat: TypeBus_TypeSeat[]
}

const initialPagination: Pagination = {
  current: 1,
  pageSize: 20,
};

interface ItableData {
  data: BusStructure[],
  pagination: Pagination,
  loading: boolean,
  editPrepare: TypeBus[],
  seatStructureData: SeatStructure[],
}

const BusStructureComponent: React.FC = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<ItableData>({
    data: [],
    pagination: initialPagination,
    loading: false,
    editPrepare: [],
    seatStructureData: []
  });
  const [editingKey, setEditingKey] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visibleAddSeatStructure, setVisibleAddSeatStructure] = useState(false);
  const [seatStructureData, setSeatStructureData] = useState<ISTTData>({ Bus_Structrue: {} as BusStructure, Typebus_Typeseat: [] })

  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const navigate = useNavigate();


  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getBusStructureTableData(pagination).then((res) => {
        getTypeBusTableData(pagination).then((res2) => {
          getSeatStructureTableData(pagination).then((res3) => {
            if (isMounted.current) {
              setTableData({
                data: res.data,
                pagination: res.pagination,
                loading: false,
                editPrepare: res2.data,
                seatStructureData: res3.data,
              });
            }
          })
        })
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const showFormModal = (type: "bus-stt" | "seat-stt") => {
    type === "bus-stt" ? setVisible(true) : setVisibleAddSeatStructure(true);
  };

  const hideFormModal = (type: "bus-stt" | "seat-stt") => {
    type === "bus-stt" ? setVisible(false) : setVisibleAddSeatStructure(false);
  };

  const PrepareCreateSeatStt = async (bus_stt: BusStructure) => {
    await getTypeBusTypeSeatData(initialPagination).then((res) => {
      const tb_ts = res.data.filter(e=>e.idTypeBus===bus_stt.idTypeBus);
      console.log(tb_ts)
      setSeatStructureData({ Bus_Structrue: bus_stt, Typebus_Typeseat: tb_ts });
    })
    showFormModal("seat-stt");
  }
  const createSeatStt = async (data:SeatStructure[])=>{
    
    const rs = await CreateSeatStructure(data);
    console.log(data,rs)
    if(rs.length > 0){
      message.success("Create Success")
    }else {
      message.error("Create Faild")
    }
    hideFormModal("seat-stt");
  }

  const create = async (data: BusStructure) => {
    const rs = await CreateBusStructure(data);
    if (rs) {
      rs.idTypeBusNavigation = tableData.editPrepare.find(e => e.id === rs.idTypeBus) as TypeBus;
      let newdata = [...tableData.data];
      newdata.push(rs);
      setTableData({ ...tableData, data: newdata });
      message.success("Create Success")
    } else {
      message.error("Create Faild")
    }
    setVisible(false);
  }

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields());
      const newData = [...tableData.data];
      const index = newData.findIndex((item) => key === item.id);

      if (index > -1) {
        const item = newData[index];
        row['id'] = item.id;
        console.log(row);
        const rs = await EditBusStructure(row);
        if (rs) {
          if (row.idTypeBus != item.idTypeBus) {
            row['idTypeBusNavigation'] = tableData.editPrepare.find(e => e.id === row.idTypeBus);
          }
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          message.success("Edit Success");
        } else {
          message.success("Edit faild");
        }
      } else {
        message.success("Not found");
      }
      setTableData({ ...tableData, data: newData });
      setEditingKey(0);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const edit = (record: Partial<BusStructure> & { id: React.Key }) => {
    form.setFieldsValue({ Row: 0, Col: 0, ...record });
    form.setFieldValue('idTypeBus', record.idTypeBus);
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetch(pagination);
    cancel();
  };

  const handleDeleteRow = async (rowid: number) => {
    const rs = await DeleteBusData({ name: "bus-stt", id: rowid });
    if (rs) {
      setTableData({ ...tableData, data: tableData.data.filter((item) => item.id !== rowid) });
      message.success("Delete Success");
    } else {
      message.error("Delete Faild");
    }
  };

  const isEditing = (record: BusStructure) => record.id === editingKey;

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: '5%',
      editable: false,
    },
    {
      title: t('tables.busStructure.row'),
      dataIndex: 'row',
      width: '20%',
      editable: true,
    },
    {
      title: t('tables.busStructure.col'),
      dataIndex: 'col',
      width: '20%',
      editable: true,
    },
    {
      title: t('common.busType'), // ['Type_Bus','Name']
      dataIndex: 'idTypeBus',
      width: '20%',
      editable: true,
      render: (text: string, record: BusStructure) => record.idTypeBusNavigation?.name
    },
    {
      title: t('common.preview'),
      dataIndex: 'Preview',
      width: '15%',
      editable: false,
      render: (text: string, record: BusStructure) => {
        const check = tableData.seatStructureData.find(e => e.idBusStructure === record.id);
        return check ? (<Button type="primary"  >
          {t('common.preview')}
        </Button>) : (
          <BaseButtonsForm.Provider
            onFormFinish={(name, { values, forms }) => {
              // call api post data.
              if (name === "seatStructureForm") {
                console.log(values as SeatStructure[])
                createSeatStt(values as SeatStructure[]);
              }
            }}
          >
            <Button type="default" onClick={() => PrepareCreateSeatStt(record)} >{t('forms.bus.newSeatStructure')}</Button>
            <AddSeatStructureFormModal setUpCreate={seatStructureData} visible={visibleAddSeatStructure} onCancel={() => hideFormModal("seat-stt")} />
          </BaseButtonsForm.Provider>

        )
      }
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '20%',
      render: (text: string, record: BusStructure) => {
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
                <Popconfirm title={t('tables.deleteInfo')} onConfirm={() => handleDeleteRow(record.id)}>
                  <Button type="default" disabled={editingKey !== 0} danger>
                    {t('tables.delete')}
                  </Button>
                </Popconfirm>
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
      onCell: (record: BusStructure) => ({
        record,
        inputType: col.dataIndex === 'idTypeBus' ? 'select' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        typeBus: col.dataIndex === 'idTypeBus' ? tableData.editPrepare : null,
      }),
    };
  });


  return (
    <>
      {/* create & edit modal */}
      <BaseButtonsForm.Provider
        onFormFinish={(name, { values, forms }) => {
          // call api post data.
          if (name === "busStructureForm") {
            values['id'] = 0;
            create(values as BusStructure);
          }
        }}
      >
        <Button type="default" style={{ "marginBottom": 15 + 'px' }} onClick={() => showFormModal("bus-stt")}>
          {t('common.create')}
        </Button>
        <AddBusStructureFormModal visible={visible} onCancel={() => hideFormModal("bus-stt")} TypeBus={tableData.editPrepare} />
      </BaseButtonsForm.Provider>


      {/* list &  delete in table */}
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditBusStructrueTableCell,
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
export default BusStructureComponent;
