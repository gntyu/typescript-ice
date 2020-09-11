/*
 * @Author: your name
 * @Date: 2020-09-09 14:05:02
 * @LastEditTime: 2020-09-10 11:13:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /tsice/src/routes.ts
 */
import BasicLayout from '@/layouts/BasicLayout';
import Dashboard from '@/pages/Dashboard';
import Apilist from '@/pages/Apilist';


const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      { path: '/apilist', component: Apilist },
      { path: '/', exact: true, component: Dashboard },
    ],
  },
];

export default routerConfig;
