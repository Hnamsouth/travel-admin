import React from 'react';
import { useTranslation } from 'react-i18next';
import ProfileNavItem from '@app/constants/profileNavData';
import { useLocation, useNavigate } from 'react-router-dom';
import * as S from './Nav.styles';
interface NavType {
    NavData:ProfileNavItem[],
    prefix:string
}

export const Nav: React.FC<NavType> = ({NavData,prefix}) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <S.Wrapper>
      {NavData.map((item) => (
        <S.Btn
          key={item.id}
          icon={item.icon}
          type="text"
          color={item.color}
          onClick={() => navigate(item.href)}
          isActive={`/${prefix}/${item.href}` === location.pathname}
        >
          {t(item.name)}
        </S.Btn>
      ))}
    </S.Wrapper>
  );
};
