import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import TypeBus from '@app/components/Admin/Bus/TypeBus/TypeBus';
import RouteList from '@app/components/Admin/route/RouteList';

const RoutePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      <RouteList/>
    </>
  );
};

export default RoutePage;
