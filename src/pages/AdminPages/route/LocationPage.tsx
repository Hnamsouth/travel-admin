import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import Locations from '@app/components/Admin/route/Location/Locations';

const LocationPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      <Locations/>
    </>
  );
};

export default LocationPage;
