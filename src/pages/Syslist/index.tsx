import React, { SFC, useState, useMemo } from 'react';
import {
  Card,
  Form,
  Input,
  Message,
  Button,
  Table,
  Divider,
  Dialog,
  Pagination,
} from '@alifd/next';
import axios from 'axios';

interface Filter {
  sysCode: string;
  context: string;
}
interface System {
  context: string;
  createTime: string;
  id: string;
  order: number;
  sysCode: string;
  sysName: string;
  updateTime: string;
  edited?: boolean;
}

const Syslist: SFC = () => {

  const [filter, setFilter] = useState<Filter>({
    syscode: '',
    context: '',
  });
  const [dataSource, setDataSource] = useState<Array<System>>();
  const [list, setList] = useState<Array<System>>();
  const [filterList, setFilterList] = useState<Array<System>>();
  const [cacheList, setCacheList] = useState<Array<System>>();
  const [page, setPage] = useState<number>(1);
  const [reload, setReload] = useState<Date>(new Date());


  useMemo(() => {
    const fetch = async () => {
      const res = await axios.post("/lyapi/systems", {});
      setDataSource(res.data.data.list);
    }
    fetch();
  }, [reload]);

  useMemo(() => {
    if (dataSource) {
      const newlist = dataSource.filter(item => {
        if (filter.sysCode && item.sysCode.toString().indexOf(filter.sysCode) <= -1) {
          return false
        }
        if (filter.context && item.context.indexOf(filter.context) <= -1) {
          return false
        }
        return true
      })
      setFilterList(newlist);
      setPage(1);
      const _newlist = newlist.slice(0, 10);
      setList(JSON.parse(JSON.stringify(_newlist)));
      setCacheList(JSON.parse(JSON.stringify(_newlist)));

    }
  }, [filter, dataSource]);

  const changeFilter = (filter: Filter) => {
    setFilter(filter);
  }

  const addNew = () => {
    if (list.filter(item => !item.id).length > 0) {
      Message.error("一次只能新增一条数据！")
      return
    }
    const _newRow = {
      context: "",
      sysCode: "",
      sysName: "",
      edited: true,
    }
    setList([...list,_newRow]);
  }

  const deleteRow = (row: System) => {
    Dialog.confirm({
      content: `确定要删除系统：${row.sysName} ?`,
      onOk: () => {
        const submit = async () => {
          const res = await axios.post('/lyapi/deletesystem', row);
          if (res.data.errorCode === 0) {
            Message.success("删除成功！");
            setReload(new Date());
          }
        }
        submit();
      },
    });
  }

  const changePage = (page: number) => {
    setPage(page);
    const _newlist = filterList.slice((page - 1) * 10, page * 10);
    setList(JSON.parse(JSON.stringify(_newlist)));
    setCacheList(JSON.parse(JSON.stringify(_newlist)));

  }

  const submit = async (index: number) => {
    const obj = { ...list[index] };
    let url = "/lyapi/updatesystem";
    if (obj.id) {
      delete obj.edited;
      delete obj.createTime;
      delete obj.updateTime;
      delete obj.order;
    } else {
      url="/lyapi/addsystem";
    }
    const res = await axios.post(url, obj);
    if (res.data.errorCode === 0) {
      Message.success('更新成功!');
      setReload(new Date());
    } else {
      Message.error('更新失败:' + res.data.errorDetail);
    }

  }

  const changeRowData = (index: number, key: keyof System, value: string | number | boolean | [], type?: string) => {
    const systems: System[] = [...list];
    (systems[index][key] as string | number | boolean | []) = value;
    if (type === 'cancel') {
      systems[index].id ? systems[index] = { ...cacheList[index] } : systems.pop();
    }
    setList(systems);
  }

  const renderEditCell = (v: string, i: number, row: System, key: keyof System) => {
    if (row.edited) {
      return <Input style={{ width: '100%' }} onChange={(value) => changeRowData(i, key, value)} value={v || ''} />;
    }
    return v;
  }


  return (
    <div >
      <Card free >
        <Card.Content>
          <Form responsive fullWidth onChange={(filter) => changeFilter(filter)} labelAlign="left">
            <Form.Item colSpan={4} label="系统编码:" >
              <Input name="sysCode" placeholder="请输入系统编码" />
            </Form.Item>
            <Form.Item colSpan={4} label="上下文:" >
              <Input name="context" placeholder="请输入上下文" />
            </Form.Item>

          </Form>

        </Card.Content>
      </Card>
      <div style={{ height: 20 }}></div>
      <Card free >
        <Card.Content >
          {/* <Button type="primary" onClick={() => addNew()} style={{ marginBottom: 10 }}>新建</Button> */}
          <Table dataSource={list} hasBorder={true} >
            <Table.Column dataIndex="order" title="序号" />
            <Table.Column dataIndex="context" title="上下文" cell={(v: string, i: number, row: System) => renderEditCell(v, i, row, 'context')} />
            <Table.Column dataIndex="sysCode" title="系统编码" cell={(v: string, i: number, row: System) => renderEditCell(v, i, row, 'sysCode')} />
            <Table.Column dataIndex="sysName" title="系统名称" cell={(v: string, i: number, row: System) => renderEditCell(v, i, row, 'sysName')} />
            <Table.Column dataIndex="updateTime" title="更新时间" />
            <Table.Column dataIndex="" title="操作" cell={(v: string, i: number, row: System) => {
              if (row.edited) {
                return (
                  <div>
                    <Button text type="primary" onClick={() => submit(i)}>保存</Button>
                    <Divider direction="ver" />
                    <Button text type="primary" onClick={() => changeRowData(i, "edited", false, 'cancel')}>取消</Button>
                  </div>
                );
              }
              return (
                <div>
                  <Button type="primary" onClick={() => changeRowData(i, "edited", true)} text>编辑</Button>
                  <Divider direction="ver" />
                  <Button type="primary" text disabled={row.order < 5} onClick={() => deleteRow(row)}>删除</Button>
                </div>
              );
            }} />
          </Table>
          
          <div onClick={() => addNew()} style={styles.addNewItem}>
            + 新增一行
          </div>
          <div style={{ height: 20 }}></div>
          <Pagination onChange={(page) => changePage(page)} total={filterList ? filterList.length : 0} current={page} />
        </Card.Content>
      </Card>

    </div>
  )
}
export default Syslist;

const styles = {
  addNewItem: {
    background: '#F5F5F5',
    height: 32,
    lineHeight: '32px',
    marginTop: 20,
    cursor: 'pointer',
    textAlign: 'center',
  }
};