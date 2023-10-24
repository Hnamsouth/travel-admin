import React from 'react';
import { Input, Form } from 'antd';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { useTranslation } from 'react-i18next';
import { Location } from '@app/api/main/route.api';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: string;
    record: Location;
    index: number;
    children: React.ReactNode;
}

export const EditLocationTableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    children,
    ...restProps
}) => {
    const { t } = useTranslation()
    const areas = [
        {
            value: "City",
            title: t('common.route.location.city')
        },
        {
            value: "District",
            title: t('common.route.location.district')
        },
        {
            value: "Ward",
            title: t('common.route.location.ward')
        },
    ]

    const inputMode = dataIndex === "area" ?
        <Select placeholder={t('forms.validationFormLabels.selectCountry')}>
            {areas.map((e,i) => <Option key={i} value={e.value}>{e.title}</Option>)}
        </Select> :  <Input />;
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
