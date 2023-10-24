import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import TicketList from '@app/components/Admin/Ticket/List/TicketList';


const TicketListPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      <TicketList/>
    </>
  );
};

export default TicketListPage;
