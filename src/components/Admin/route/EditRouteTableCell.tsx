import React from 'react';
import { Input, Form, InputNumber, FormInstance } from 'antd';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { useTranslation } from 'react-i18next';
import { Location, Route } from '@app/api/main/route.api';
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: string;
    record: Route;
    children: React.ReactNode;
    location: Location[]
    form: FormInstance
}

export const EditRouteTableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    location,
    children,
    record,
    form,
    ...restProps
}) => {
    const { t } = useTranslation()

    const checkLocation = (_: any, value: any) => {
        let FromCurrent = form.getFieldValue("idFromLocation");
        let ToCurrent = form.getFieldValue("idToLocation");
        if ((dataIndex == "idFromLocation" && ToCurrent === value) || (dataIndex == "idToLocation" && FromCurrent === value)) {
            return Promise.reject(t('common.route.location.messSelectErr'))
        }
        form.isFieldValidating(dataIndex === "idFromLocation" ? "idToLocation" : "idFromLocation")
        return Promise.resolve();
    }

    const inputMode = dataIndex === "idFromLocation" || dataIndex === "idToLocation" ?
        <Select placeholder={t('forms.validationFormLabels.selectCountry')}>
            {location.map((e) => <Option key={e.id} value={e.id}><strong>{e.name}</strong>:{e.addres}...</Option>)}
        </Select> : dataIndex === "time" ? <Input /> : <InputNumber />;
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
                        {
                            validator: checkLocation
                        }
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
