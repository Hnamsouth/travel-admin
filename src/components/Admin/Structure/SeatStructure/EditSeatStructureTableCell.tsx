import React from 'react';
import { Input, Form } from 'antd';
import {  TypeSeat } from '@app/api/main/bus.api';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: TypeSeat;
  index: number;
  children: React.ReactNode;
}

export const EditSeatStructureTableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
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
          {<Input/>}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
