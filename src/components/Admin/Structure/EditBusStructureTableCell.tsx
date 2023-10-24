import React from 'react';
import { Input, InputNumber, Form } from 'antd';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { useTranslation } from 'react-i18next';
import { BusStructure, TypeBus } from '@app/api/main/bus.api';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: BusStructure;
  index: number;
  children: React.ReactNode;
  typeBus: TypeBus[]
}

export const EditBusStructrueTableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  typeBus,
  ...restProps
}) => {
  const { t } = useTranslation();
  const inputNode = inputType === 'select' ?
    <Select placeholder={t('forms.validationFormLabels.selectCountry')}>
      {typeBus.map((e) => {
        return (
          <Option key={e.id} value={e.id}>{e.name}</Option>
        )
      })}
    </Select> : <InputNumber />
    ;
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
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
