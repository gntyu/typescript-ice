/*
 * @Author: your name
 * @Date: 2020-09-09 14:05:02
 * @LastEditTime: 2020-09-10 11:13:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /tsice/src/routes.ts
 */
import BasicLayout from '@/layouts/BasicLayout';
import Apilist from '@/pages/Apilist';
import Syslist from '@/pages/Syslist';
import Dynamic from '@/pages/Dynamic';


const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      { path: '/', exact: true, component: Apilist },
      { path: '/syslist',component: Syslist },
      { path: '/dynamic',component: Dynamic },
    ],
  },
];

export default routerConfig;
