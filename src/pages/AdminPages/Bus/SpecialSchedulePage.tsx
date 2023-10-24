import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import TravelRouteComponent from '@app/components/Admin/Bus/TravelRoute/TravelRoute';

const SpecialSchedulePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <PageTitle>{t('common.feed')}</PageTitle>
            <TravelRouteComponent />
        </>
    );
};

export default SpecialSchedulePage;
