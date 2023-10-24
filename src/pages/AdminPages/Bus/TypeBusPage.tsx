import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import TypeBuss from '@app/components/Admin/Bus/TypeBus/TypeBus';

const TypeBusPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      <TypeBuss/>
    </>
  );
};

export default TypeBusPage;
