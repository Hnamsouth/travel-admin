import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import BusList from '@app/components/Admin/Bus/List/BusList';

const BusListPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      <BusList/>
    </>
  );
};

export default BusListPage;
