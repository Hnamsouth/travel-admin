import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import BusStructureComponent from '@app/components/Admin/Structure/BusStructure';

const BusStructurePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      <BusStructureComponent/>
    </>
  );
};

export default BusStructurePage;
