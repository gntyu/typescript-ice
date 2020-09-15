import React from 'react';
import echarts from 'echarts/lib/echarts';
// import Chart from './Chart';
import Echart from './Echart';

const WholeDay: React.SFC = (props) => {

  
  let option = {};
  if (props.data) {
    const { list,total } = props.data;
    const colors = ['#57617B', '#57617B', '#57617B', 'black'];
    option = {
      color: colors,
      title: {
        text: "实时使用量分析",
        subtext: '使用总量：' + total,
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        left: '5%',
        right: '10%',
        bottom: '20%',
        // top: '2%',
        containLabel: true
      },
      toolbox: {
        feature: {
          dataView: {
            show: true,
            readOnly: false
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        }
      },

      dataZoom: [{
        show: true,
        start: 0,
        end: 100,
        bottom: '8%'
      },],
      xAxis: [{
        type: 'category',
        // boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: colors[1]
          }
        },
        data: list.map(item => item.date)
      }],
      yAxis: {
        type: 'value',
        name: '使用次数',
        min: 0,
        position: 'right',
        axisLine: {
          lineStyle: {
            color: colors[2]
          }
        },
        axisLabel: {
          formatter: '{value}次'
        },
        splitLine: {
          lineStyle: {
            color: '#57617B'
          }
        },
      },
      series: [{
        name: '使用次数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(219, 50, 51, 0.3)'
            }, {
              offset: 0.8,
              color: 'rgba(219, 50, 51, 0)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {

            color: 'rgb(219,50,51)',
            borderColor: 'rgba(219,50,51,0.2)',
            borderWidth: 12
          }
        },
        data: list.map(item => item.value)
      }]
    }
  }

  return (
    <div>
      <Echart option={option} height={400} />
    </div>
  );

}

export default WholeDay;
