import React from 'react';
import { Input ,InputNumber, Form ,message, Upload} from 'antd';
import {  TypeBus, removeimg } from '@app/api/main/bus.api';
import { UploadOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import { Button } from '@app/components/common/buttons/Button/Button';
import { LocalUrl } from '@app/api/http.api';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: TypeBus;
  index: number;
  children: React.ReactNode;
}

export const EditTypeBusTableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {

  const {t}= useTranslation();
  const RemoveImg =  (data:any)=>{
    console.log(data.response)
    removeimg(data.response.public_id)
  }

  const uploadProps = {
    name: 'file',
    // multiple: true,
    action: LocalUrl+'type-bus/upload-img',// api post img
    onChange: (info: any) => {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info);
      }
      if (status === 'done') {
        message.success(t('uploads.successUpload', { name: info.file.name }));
      } else if (status === 'error') {
        message.error(t('uploads.failedUpload', { name: info.file.name }));
      }
    },
    onRemove: RemoveImg
  };

const inputMode = dataIndex==="name"?<Input/>:
  dataIndex==="pricePlus"?<InputNumber/>:
  <Upload {...uploadProps} openFileDialogOnClick>
    <Button icon={<UploadOutlined />}>{t('uploads.clickToUpload')}</Button>
  </Upload>

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
