import React from 'react';
import {
  CompassOutlined,
  DashboardOutlined,
  FormOutlined,
  HomeOutlined,
  LayoutOutlined,
  LineChartOutlined,
  TableOutlined,
  UserOutlined,
  BlockOutlined,
} from '@ant-design/icons';
import { ReactComponent as NftIcon } from '@app/assets/icons/nft-icon.svg';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.pageForAdmin',
    key: 'pageForAdmin',
    icon: <BlockOutlined />,
    children: [
      {
        title: 'common.busSchedule',
        key: 'busSchedule',
        url: '/admin/bus-schedule',
      },
    ]
  },
  {
    title: 'common.bus.title',
    key: 'bus',
    icon: <BlockOutlined />,
    children: [
      {
        title: 'common.busSchedule',
        key: 'busSchedule',
        url: '/schedule',
      },
      {
        title: 'common.bus.title',
        key: 'bus',
        url: '/bus/lct',
      },
      {
        title: 'common.busStructure.name',
        key: 'busStructure',
        url: '/bus/structure',
      },
    ]
  },
  {
    title: 'common.route.title',
    key: 'route',
    icon: <BlockOutlined />,
    children: [
      {
        title: 'common.route.list',
        key: 'list',
        url: '/route/list',
      },
      {
        title: 'common.routeDetail',
        key: 'routeDetail',
        url: '/route/detail',
      },
    ]
  },
  {
    title: 'common.ticket.title',
    key: 'ticket',
    icon: <BlockOutlined />,
    children: [
      {
        title: 'common.ticket.list',
        key: 'list',
        url: '/ticket/list',
      },
      {
        title: 'common.ticket.detail.title',
        key: 'ticketdetail',
        url: '/ticket/detail',
      },
    ]
  },
 

];
