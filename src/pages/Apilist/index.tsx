import React, { SFC, useState, useEffect,useMemo } from 'react';
import { useSetState } from 'ahooks';
import {
  Card,
  Form,
  Input,
  Message,
  Button,
  Table,
  Checkbox,
  Divider,
  Dialog,
  Pagination,
} from '@alifd/next';
import axios from 'axios';
import DialogOperation from './DialogOperation';
import { ActionType } from './DialogOperation';
// import styles from './index.module.scss';
const styles = require('./index.module.scss');

interface Api {
  createTime: string;
  desc: string;
  firstPath: string;
  forthPath: string;
  id: string;
  isExtend: number;
  isRandom: number;
  isStrict: number;
  method: string;
  nums: number;
  order: number;
  path: string;
  result: string;
  updateTime: string;
}

interface System {
  label: string;
  value: string;
}

interface Filter {
  system: string[];
  order: string;
  path: string;
}

interface DialogState {
  optCol: any;
  actionType: ActionType;
  actionVisible: boolean;
  row: Api | {};
}

const Apilist: SFC = () => {

  const [dataSource, setDataSouce] = useState<Array<Api>>();
  const [filterList, setFilterList] = useState<Array<Api>>();
  const [page, setPage] = useState<number>(1);
  const [list, setList] = useState<Array<Api>>();
  const [syslist, setSyslist] = useState<Array<System>>();
  const [filter, setFilter] = useState<Filter>({
    system:[],
    path:'',
    order:'',
  });

  const [reload, setReload] = useState<Date>(new Date());
  const [dialog, setDialog] = useSetState<DialogState>({
    optCol: null,
    actionType: 'preview',
    actionVisible: false,
    row: {}
  });


  useEffect(() => {
    // console.log('....0000')
    const fetch = async () => {
      const sys = await axios.get('/lyapi/getsys');
      setSyslist(sys.data.data.list)
    }
    fetch();
  }, []);

  useMemo(() => {
    // console.log('....11')
    const fetch = async () => {
      const api = await axios.post('/lyapi/apilist', { syscode: [] });
      setDataSouce(api.data.data.list);
    }
    fetch();
  }, [reload]);

  useMemo(() => {
    // console.log('....22')
    if (dataSource) {
      const newlist = dataSource.filter(item => {
        if (filter.system && filter.system.length > 0 && !filter.system.includes(item.syscode)) {
          return false
        }
        if (filter.order && item.order.toString().indexOf(filter.order) <= -1) {
          return false
        }
        if (filter.path && item.path.indexOf(filter.path) <= -1) {
          return false
        }
        return true
      })
      setFilterList(newlist);
      setPage(1);
      setList(newlist.slice(0, 10));
    }
  }, [filter,dataSource]);


  const changePage = (page: number) => {
    setPage(page);
    setList(filterList.slice((page - 1) * 10, page * 10));
  }

  const changeFilter = (filter: Filter) => {
    setFilter(filter);
  }

  const changeRowData = (row: Api) => {
    setDialog({ actionVisible: true, actionType: 'edit', row });

  }
  const addNew = () => {
    setDialog({ actionVisible: true, actionType: 'add', row: {} });
  }

  const handleCancel = () => {
    setDialog({ actionVisible: false });
  }

  const handleOk = (data: {}, type: string) => {
    const submit = async () => {
      const res = await axios.post(`/lyapi/${type}`, data);
      if (res.data.errorCode === 0) {
        Message.success("提交成功！");
        setDialog({ actionVisible: false });
        setReload(new Date());
      }
    }
    submit();
  }


  const deleteRow = (row: Api) => {
    Dialog.confirm({
      content: `确定要删除api：${row.path} ?`,
      onOk: () => {
        const submit = async () => {
          const res = await axios.post('/lyapi/deleteapi', row);
          if (res.data.errorCode === 0) {
            Message.success("删除成功！");
            setDialog({ actionVisible: false });
            setReload(new Date());
          }
        }
        submit();
      },
    });
  };

  // console.log("==渲染==")
  return (
    <div className={styles.GroupForm}>
      <Card free className={styles.Card}>

        <Card.Content>
          <Form responsive fullWidth onChange={(filter) => changeFilter(filter)} labelAlign="left">
            <Form.Item colSpan={24} label="系统:" >
              <Checkbox.Group dataSource={syslist} name="system" />
            </Form.Item>
            <Form.Item colSpan={4} label="序号:" >
              <Input name="order" placeholder="请输入序号" />
            </Form.Item>
            <Form.Item colSpan={4} label="路径:" >
              <Input name="path" placeholder="请输入路径" />
            </Form.Item>

          </Form>

        </Card.Content>
      </Card>

      <Card free className={styles.Card}>
        <Card.Content >
          <Button type="primary" onClick={() => addNew()} style={{ marginBottom: 10 }}>新建</Button>

          <Table dataSource={list} hasBorder={true} className={styles.Table}>
            <Table.Column dataIndex="order" title="序号" />
            <Table.Column dataIndex="path" title="路径" />
            <Table.Column dataIndex="desc" title="描述" />
            <Table.Column dataIndex="method" title="方式" />
            <Table.Column dataIndex="updateTime" title="更新时间" />
            <Table.Column dataIndex="sysname" title="所属系统" />
            <Table.Column dataIndex="isStrict" title="严格模式" cell={(v: number) => (v == 1 ? "是" : "否")} />
            <Table.Column dataIndex="" title="操作" cell={(v: string, i: number, row: Api) => {
              return (
                <div>
                  <Button type="primary" onClick={() => changeRowData(row)} text>编辑</Button>
                  <Divider direction="ver" />
                  <Button type="primary" text onClick={() => deleteRow(row)}>删除</Button>
                </div>
              );
            }} />
          </Table>
          <Pagination onChange={(page) => changePage(page)} total={filterList?filterList.length:0} current={page} className={styles.Pagination} />
        </Card.Content>
      </Card>

      <DialogOperation
        visible={dialog.actionVisible}
        actionType={dialog.actionType}
        dataSource={dialog.row}
        syslist={syslist}
        onOk={handleOk}
        onClose={handleCancel}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default Apilist;
