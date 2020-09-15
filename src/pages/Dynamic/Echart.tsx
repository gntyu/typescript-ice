import React, { useEffect, useRef } from "react";
import echarts from 'echarts';

const Echart: React.FC = ( props) => {
  const chartDom = useRef(null);
  let chartInstance: any = null;
  const { option ,width, height} = props;

  const renderChart = () => {
    chartInstance = echarts.init(chartDom.current as unknown as HTMLDivElement);
    chartInstance.setOption(option)
  };

  useEffect(() => {
    renderChart();
  }, [option,height]);

  return (
    <div>
      <div style={{ width:width||'100%',height:height||400  }} ref={chartDom} />
    </div>
  );
};

export default Echart