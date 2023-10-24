import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import SeatStructureComponent from '@app/components/Admin/Structure/SeatStructure/SeatStructure';

const SeatStructurePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      <SeatStructureComponent/>
    </>
  );
};

export default SeatStructurePage;
