import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import TypeSeatComponent from '@app/components/Admin/Structure/TypeSeat/TypeSeat';

const TypeSeatPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      <TypeSeatComponent/>
    </>
  );
};

export default TypeSeatPage;
