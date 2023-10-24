import React from 'react';
import { Input, InputNumber, Form, Select } from 'antd';

import { Route, TravelRoute } from '@app/api/main/route.api';
import { Option } from '@app/components/common/selects/Select/Select';
import { ArrowRightOutlined } from '@ant-design/icons';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  routes: Route[];
  record: TravelRoute;
  index: number;
  children: React.ReactNode;
}

export const EditTypeBusTableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  routes,
  children,
  ...restProps
}) => {

  const inputMode = dataIndex === "idRoute" ? <Select placeholder={"Choose Route"}>
    {routes && routes.map((e, i) => <Option key={i} value={e.id}>{e.idFromLocationNavigation?.name}  <ArrowRightOutlined />{e.idToLocationNavigation?.name}    </Option>)}
  </Select> : <Input type='time' />;


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
};
