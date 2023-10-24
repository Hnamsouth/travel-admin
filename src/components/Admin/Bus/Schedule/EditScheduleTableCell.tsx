import React from 'react';
import { Form } from 'antd';
import { Buss } from '@app/api/main/bus.api';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { BusSchedule } from '@app/api/main/route.api';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: BusSchedule;
  index: number;
  Bus: Buss[],
  DoW:{value:number,title:string}[],
  Status: { Id: number, title: string }[],
  children: React.ReactNode;
}

export const EditScheduleTableCell: React.FC<EditableCellProps> = React.memo(({
  editing,
  dataIndex,
  title,
  inputType,
  Bus,
  DoW,
  Status,
  children,
  ...restProps
}) => {
  const inputMode =  dataIndex === "idBus" ?
      <Select placeholder={dataIndex} key={dataIndex}>
        {Bus.map((e, i) => <Option key={i} value={e.id}>{e.idTypeBusNavigation?.name} ({e.number})</Option>)}
      </Select> : dataIndex === "status" ?
        <Select placeholder={dataIndex} key={dataIndex}>
          {Status.map((e, i) => <Option key={i} value={e.Id}>{e.title}</Option>)}
        </Select> : dataIndex === "dayOfWeek" ?
        <Select placeholder={dataIndex} key={dataIndex}>
            {DoW.map((e, i) => <Option key={i} value={e.value} >{e.title}</Option>)}
        </Select> : <></>;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputMode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}
 )