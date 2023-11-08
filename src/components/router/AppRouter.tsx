import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';
import SignUpPage from '@app/pages/SignUpPage';
import ForgotPasswordPage from '@app/pages/ForgotPasswordPage';
import SecurityCodePage from '@app/pages/SecurityCodePage';
import NewPasswordPage from '@app/pages/NewPasswordPage';
import LockPage from '@app/pages/LockPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';

import MainLayout1 from '../layouts/CustomLayout/MainLayout1';
import { BusScheduleNavData, BussNavData, RouteNavData, StructureNavData } from '@app/constants/profileNavData';
import HomeDashboard from '../Admin/Home';

const Logout = React.lazy(() => import('./Logout'));
const BusSchedulePage = React.lazy(() => import('@app/pages/AdminPages/Bus/Schedule/BusSchedulePage'));
const BusStructurePage = React.lazy(() => import('@app/pages/AdminPages/Bus/Structure/BusStructurePage'));
const SeatStructurePage = React.lazy(() => import('@app/pages/AdminPages/Bus/Structure/SeatStructurePage'));
const TypeSeatPage = React.lazy(() => import('@app/pages/AdminPages/Bus/Structure/TypeSeatPage'));
const TypeBusPage = React.lazy(() => import('@app/pages/AdminPages/Bus/TypeBusPage'));
const BusListPage = React.lazy(() => import('@app/pages/AdminPages/Bus/BusListPage'));
const LocationPage = React.lazy(() => import('@app/pages/AdminPages/route/LocationPage'));
const RoutePage = React.lazy(() => import('@app/pages/AdminPages/route/RoutePage'));

const TicketListPage = React.lazy(() => import('@app/pages/AdminPages/Tiket/TicketListPage'));
const TicketDetailPage = React.lazy(() => import('@app/pages/AdminPages/Tiket/TicketDetail'));

const TravelRoutePage = React.lazy(() => import('@app/pages/AdminPages/Bus/TravelRoutePage'));
const SpecialSchedulePage = React.lazy(() => import('@app/pages/AdminPages/Bus/SpecialSchedulePage'));


export const HOME_DASHBOARD = '/';
export const MEDICAL_DASHBOARD_PATH = '/medical-dashboard';


const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

// Page for Admin BusStructurePage

const BusSchedule = withLoading(BusSchedulePage);
const BusStructure = withLoading(BusStructurePage);
const SeatStructure = withLoading(SeatStructurePage);
const TypeSeat = withLoading(TypeSeatPage);
const TypeBus = withLoading(TypeBusPage);
const BusList = withLoading(BusListPage);
const Location = withLoading(LocationPage);
const RouteList = withLoading(RoutePage);
const TicketList = withLoading(TicketListPage);
const TicketDetail = withLoading(TicketDetailPage);
const TravelRoute = withLoading(TravelRoutePage);
const SpecialSchedule = withLoading(SpecialSchedulePage);


export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME_DASHBOARD} element={protectedLayout}>
          <Route index element={<HomeDashboard/>}/>
          <Route path="admin">
            <Route path="bus-schedule" element={<BusSchedule />} />
          </Route>
          <Route path="bus">
            <Route path="lct" element={<MainLayout1 prefix={'/bus/lct'} start={'list'} pageTitle={'common.bus.title'} NavData={BussNavData} />}>
              <Route path="list" element={<BusList />} />
              <Route path="type" element={<TypeBus />} />
            </Route>
            <Route path="structure" element={<MainLayout1 prefix={'/bus/structure'} start={'bus-stt'} pageTitle={'common.busStructure.name'} NavData={StructureNavData} />}>
              <Route path="type-seat" element={<TypeSeat />} />
              <Route path="bus-stt" element={<BusStructure />} />
              <Route path="seat-stt" element={<SeatStructure />} />
            </Route>
          </Route>
          <Route  path="schedule" element={<MainLayout1 prefix={'/schedule'} start={'list'} pageTitle="schedule" NavData={BusScheduleNavData} />}>
            <Route  path="list" element={<BusSchedule />} />
            <Route path="travel-route" element={<TravelRoute />} />
            <Route  path="special-schedule" element={<SpecialSchedule />} />
          </Route>
          <Route path="route" element={<MainLayout1 prefix={'/route'} start={'list'} pageTitle={'common.route.title'} NavData={RouteNavData} />}>
            <Route path="list" element={<RouteList />} />
            <Route path="location" element={<Location />} />
            <Route path="detail" element={<BusSchedule />} />
          </Route>
          <Route path='ticket'>
            <Route path='list' element={<TicketList />} />
            <Route path='detail' element={<TicketDetail />} />
          </Route>
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route
            path="lock"
            element={
              <RequireAuth>
                <LockPage />
              </RequireAuth>
            }
          />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="security-code" element={<SecurityCodePage />} />
          <Route path="new-password" element={<NewPasswordPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
