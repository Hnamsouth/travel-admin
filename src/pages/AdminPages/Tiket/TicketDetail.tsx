import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
// import TicketDetail from '@app/components/Admin/Ticket/Detail/TicketDetail';


const TicketDetailPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.feed')}</PageTitle>
      {/* <TicketDetail/> */}
    </>
  );
};

export default TicketDetailPage;
