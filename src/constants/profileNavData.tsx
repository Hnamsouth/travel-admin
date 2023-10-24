import { BellOutlined, DollarOutlined, SecurityScanOutlined, UserOutlined, ArrowRightOutlined, } from '@ant-design/icons';
import React from 'react';

export default interface ProfileNavItem {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: 'primary' | 'error' | 'warning' | 'success';
  href: string;
}

export const profileNavData: ProfileNavItem[] = [
  {
    id: 1,
    name: 'profile.nav.personalInfo.title',
    icon: <UserOutlined />,
    color: 'primary',
    href: 'personal-info',
  },
  {
    id: 2,
    name: 'profile.nav.securitySettings.title',
    icon: <SecurityScanOutlined />,
    color: 'success',
    href: 'security-settings',
  },
  {
    id: 3,
    name: 'profile.nav.notifications.title',
    icon: <BellOutlined />,
    color: 'error',
    href: 'notifications',
  },
  {
    id: 4,
    name: 'profile.nav.payments.title',
    icon: <DollarOutlined />,
    color: 'warning',
    href: 'payments',
  },
];

export const StructureNavData: ProfileNavItem[] = [
  {
    id: 1,
    name: 'common.busStructure.name',
    icon: <ArrowRightOutlined />,
    color: 'primary',
    href: 'bus-stt',
  },
  {
    id: 2,
    name: 'common.busStructure.typeSeat',
    icon: <ArrowRightOutlined />,
    color: 'primary',
    href: 'type-seat',
  },
  {
    id: 3,
    name: 'common.busStructure.seatStructure',
    icon: <ArrowRightOutlined />,
    color: 'primary',
    href: 'seat-stt',
  },
];

export const BussNavData: ProfileNavItem[] = [
  {
    id: 1,
    name: 'common.busList',
    icon: <ArrowRightOutlined />,
    color: 'primary',
    href: 'list',
  },
  {
    id: 2,
    name: 'common.busType',
    icon: <ArrowRightOutlined />,
    color: 'primary',
    href: 'type',
  }
];

export const RouteNavData: ProfileNavItem[] = [
  {
    id: 1,
    name: 'common.route.list',
    icon: <ArrowRightOutlined />,
    color: 'primary',
    href: 'list',
  },
  {
    id: 2,
    name: 'common.route.location.title',
    icon: <ArrowRightOutlined />,
    color: 'primary',
    href: 'location',
  },
  {
    id: 2,
    name: 'common.route.detail.title',
    icon: <ArrowRightOutlined />,
    color: 'primary',
    href: 'detail',
  },
]

export const BusScheduleNavData:ProfileNavItem[] = [
  {
    id: 1,
    name: 'common.bus.schedule',
    icon: <ArrowRightOutlined />,
    color: 'primary',
    href: 'list',
  },
  {
    id: 1,
    name: 'common.bus.travelRoute',
    icon: <ArrowRightOutlined />,
    color: 'primary',
    href: 'travel-route',
  },
  {
    id: 1,
    name: 'common.bus.specialSchedule',
    icon: <ArrowRightOutlined />,
    color: 'primary',
    href: 'special-schedule',
  },
]

