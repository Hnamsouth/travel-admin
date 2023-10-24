import React from 'react';
import { Input, Form, InputNumber } from 'antd';
import {  TypeBus, TypeSeat } from '@app/api/main/bus.api';
import { RadioButton, RadioGroup } from '@app/components/common/Radio/Radio';
import { Select,Option } from '@app/components/common/selects/Select/Select';
import { useTranslation } from 'react-i18next';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: TypeSeat;
  TypeBus:TypeBus[]
  index: number;
  children: React.ReactNode;
  status:number
}

export const EditBusListTableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  TypeBus,
  status,
  children,
  ...restProps
}) => {
  const {t} = useTranslation()

  const inputMode = dataIndex==="idTypeBus"?
  <Select placeholder={t('forms.validationFormLabels.selectCountry')}>
    { TypeBus.map((e) => <Option key={e.id} value={e.id}>{e.name}</Option>) }
  </Select> :
  dataIndex==="status"? 
  <RadioGroup>
    <RadioButton value={0} className={!status?'ant-tag-warning':''}>{t('tables.status.stop')}</RadioButton>
    <RadioButton value={1} className={status?'ant-tag-success':''}>{t('tables.status.active')}</RadioButton>
  </RadioGroup>: 
  <InputNumber/>;
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
