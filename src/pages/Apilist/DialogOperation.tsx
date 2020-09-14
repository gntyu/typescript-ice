import React, { useEffect, useCallback } from 'react';
import { Dialog,Form,Field ,Input,Select, Radio} from '@alifd/next';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

export type ActionType = 'add' | 'edit' | 'preview';


export interface OperaitionProps {
  actionType: ActionType;
  dataSource: any;
}

const getDialogTitle = (actionType: ActionType): string => {
  switch (actionType) {
    case 'add':
    default:
      return '新增api';

    case 'edit':
      return '编辑api';

    case 'preview':
      return '预览api';
  }
};

const DialogOperation: React.FC = (props) => {
  const { actionType, dataSource, onOk = () => { },syslist, ...lastProps } = props;

  const field = Field.useField([]);

  useEffect(() => {
    field.reset();
    if (dataSource) {
      const values = {
        id: dataSource.id,
        isStrict: dataSource.isStrict ? 1 : 0,
        syscode:dataSource.syscode,
        method:dataSource.method,
        path:dataSource.path,
        desc:dataSource.desc,
        result:dataSource.result,
      }
      field.setValues(values);
    }
  }, [field, dataSource,lastProps.visible]);

  const handleOk = useCallback(() => {
    if (actionType === 'preview') {
      onOk(null);
    } else {
      field.validate((error, values) => { 
        if (error === null) {
          onOk(field.getValues(), actionType === 'edit' ? 'updateapi' : 'addapi');
        }
      });
    }
  }, [actionType, onOk])

  const isPreview = actionType === 'preview';
  
  return (
    <Dialog
      shouldUpdatePosition
      isFullScreen
      title={getDialogTitle(actionType)}
      style={{ width: 600 }}
      footerAlign="center"
      {...lastProps}
      onOk={handleOk}
    >
       <Form
        isPreview={isPreview}
        fullWidth
        labelAlign={'left'}
        field={field}
        {...formItemLayout}
      >
        <FormItem
          label="路径:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Input
           name="path"
          />
        </FormItem>
        <FormItem
          label="严格模式:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Select
            name="isStrict"
            dataSource={[{ label: "是", value: 1 }, { label: "否", value: 0 }]}
          />
        </FormItem>
        {field && !!field.getValue("isStrict") && <FormItem
          label="方式:"
        >
          <Radio.Group
            name="method"
            dataSource={['post', 'get']}
          />
        </FormItem>}
        <FormItem
          label="描述:"
          required={!isPreview}
        >
          <Input
            name="desc"
          />
        </FormItem>
        <FormItem
          label="所属系统:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Select
            name="syscode"
            dataSource={syslist}
          />
        </FormItem>
        <FormItem
          label="示例:"
          required={!isPreview}
        >
          <Input.TextArea
            rows={10}
            name="result"
          />
        </FormItem>
      </Form>
    </Dialog>
  );
}

export default DialogOperation;