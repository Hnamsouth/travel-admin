import React, { useEffect } from 'react';
import { Col, Row } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useResponsive } from '@app/hooks/useResponsive';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Nav } from './Nav/Nav';
import ProfileNavItem from '@app/constants/profileNavData';

interface DataLayout{
    prefix:string,
    start:string,
    pageTitle:string,
    NavData:ProfileNavItem[]
}

const MainLayout1: React.FC<DataLayout> = ({prefix,start,pageTitle,NavData}) => {
  const user = useAppSelector((state) => state.user.user);

  const { t } = useTranslation();
  const { isTablet: isTabletOrHigher, mobileOnly } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();

  const { isTablet } = useResponsive();

  const isTitleShown = isTabletOrHigher || (mobileOnly && location.pathname === prefix);
  const isMenuShown = isTabletOrHigher || (mobileOnly && location.pathname !== prefix);

  useEffect(() => {
    isTablet && location.pathname === prefix && navigate(start);
  }, [isTablet, location.pathname, navigate]);

  return (
    <>
      <PageTitle>{t(pageTitle)}</PageTitle>
      {!isTitleShown && (
        <Btn icon={<LeftOutlined />} type="text" onClick={() => navigate(prefix)}>
          {t('common.back')}
        </Btn>
      )}

      <Row gutter={[30, 30]}>
        {isTitleShown && (
          <Col xs={24} md={24} xl={24}>
            <StructureCard>
              <Row gutter={[30, 30]}>
                <Col xs={24} md={12} xl={24}>
                  <Nav NavData={NavData} prefix={prefix} />
                </Col>
              </Row>
            </StructureCard>
          </Col>
        )}

        {isMenuShown && (
          <Col xs={24} md={24} xl={24}>
            <Outlet />
          </Col>
        )}
      </Row>
    </>
  );
};

const StructureCard = styled(Card)`
  height: unset;
`;

const Btn = styled(Button)`
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
  padding: 0;
  height: unset;
  color: var(--secondary-color);
`;

export default MainLayout1;
