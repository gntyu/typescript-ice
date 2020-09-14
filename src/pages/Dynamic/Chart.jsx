import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts';
// 引入柱状图
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markLine';


export default class chart extends Component {
  static displayName = 'chart';

  constructor(props) {
    super(props);
    this.myChart = null;
    this.state = {
      ...props.option,
      domId: `chart_${new Date().getTime().toString()}_${Math.ceil(Math.random()*10000)}`,
    };
  }

  componentDidMount() {
    // const options = this.state;
    this.myChart = echarts.init(document.getElementById(this.state.domId));
    this.myChart.setOption(this.props.option);
    this.myChart.on('legendselectchanged', this.props.change);
    window.addEventListener("resize",()=>{
      this.myChart.resize();
    });
  }

  shouldComponentUpdate(props) {
    this.myChart.setOption(props.option);
    return true;
  }

  render() {
    const width = this.props.width || '100%';
    const height = this.props.height;
    return (
      <div id={this.state.domId} style={{ width,height}} />
    );
  }
}
