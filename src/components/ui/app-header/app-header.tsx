import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link to='/' className={`${styles.link} pl-5 pr-5 pb-4 pt-4`}>
            <BurgerIcon type={isActive('/') ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 mr-10 ${
                isActive('/') ? '' : 'text_color_inactive'
              }`}
            >
              Конструктор
            </p>
          </Link>
          <Link to='/feed' className={`${styles.link} pl-5 pr-5 pb-4 pt-4`}>
            <ListIcon type={isActive('/feed') ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${
                isActive('/feed') ? '' : 'text_color_inactive'
              }`}
            >
              Лента заказов
            </p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <div className={styles.link_position_last}>
          <Link to='/profile' className={`${styles.link} pl-5 pr-5 pb-4 pt-4`}>
            <ProfileIcon
              type={isActive('/profile') ? 'primary' : 'secondary'}
            />
            <p
              className={`text text_type_main-default ml-2 ${
                isActive('/profile') ? '' : 'text_color_inactive'
              }`}
            >
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
