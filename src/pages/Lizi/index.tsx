import React, { SFC, useState, useMemo } from 'react';
import {
  Input
} from '@alifd/next';
import DateRangePicker from 'react-bootstrap-monthrangepicker'
import 'bootstrap-monthrangepicker/daterangepicker.css';
import moment from 'moment'
// import 'bootstrap/dist/css/bootstrap.css';

const Locale = {
  format: 'YYYY/MM',
  separator: ' - ',
  applyLabel: '确定',
  cancelLabel: '取消',
  fromLabel: '从',
  toLabel: '至',
  customRangeLabel: '自定义',
  monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  quarterNames: ['一季度', '二季度', '三季度', '四季度'],
  firstDay: 1
}

const Lizi: SFC = () => {

  const [date, setDate] = useState('2010/12 - 2012/01');

  const applyHandler = (e, picker) => {
    let { startDate, endDate } = picker
    setDate(moment(startDate).format(Locale.format)+' - '+moment(endDate).format(Locale.format))
  }

  return (
    <div >
      <DateRangePicker
        showDropdowns
        alwaysShowCalendars
        onApply={applyHandler}
        locale={Locale}
        linkedCalendars={false}
        monthOrQuarter={0}
      >
        <Input value={date} />
      </DateRangePicker>

    </div >
  )
}
export default Lizi;

