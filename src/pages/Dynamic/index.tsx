import React, { SFC, useState, useMemo } from 'react';
import { Tab, Card } from '@alifd/next';
import axios from "axios";
import WholeDay from "./WholeDay";
import System from "./System";

const Dynamic: SFC = () => {

  const [data, setData] = useState({});

  useMemo(() => {
    const fetch = async() => {
      const today = await axios.get("/lyapi/today");
      const month = await axios.get("/lyapi/month");
      const recent = await axios.get("/lyapi/recent");
      const tops = await axios.get("/lyapi/tops");
      const system = await axios.get("/lyapi/system");
      setData({
        today:today.data.data,
        month:month.data.data,
        recent:recent.data.data,
        tops:tops.data.data,
        system:system.data.data,
      });
    }
    fetch();
  },[])

  return (
    <div>
      <Card free>
        <Card.Content>
        <h2>接口使用情况</h2>
          <Tab shape="text" >
            <Tab.Item title="今日" key="1">
              <WholeDay data={data.today} />
            </Tab.Item>
            <Tab.Item title="本月" key="2">
               <WholeDay data={data.month} />
            </Tab.Item>
            <Tab.Item title="最近" key="3">
             <WholeDay data={data.recent} />
            </Tab.Item>
          </Tab>
        </Card.Content>
      </Card>
      <div style={{ height: 20 }}></div>
      <Card free>
        <Card.Content>
          <h2>接口使用类型</h2>
          <Tab shape="text" >
            <Tab.Item title="系统汇总" key="a">
              <System data={data.system&&data.system.list} sys={data.system&&data.system.list} title="系统汇总" />
            </Tab.Item>
            <Tab.Item title="TOP20" key="b">
              <System data={data.tops&&data.tops.list} sys={data.system&&data.system.list} title="TOP20" />
            </Tab.Item>
          </Tab>
        </Card.Content>
      </Card>
    </div>
  )

}
export default Dynamic;
