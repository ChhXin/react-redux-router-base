import React from 'react';
import classNames from 'classnames';
import {urlContext} from '../../utils/config';
import {Layout, Menu} from 'antd';

const {Header} = Layout;

import logo from '../images/logo.png';

const HeaderModule = () => {
  const {pathname} = document.location;

  return (
    <Header style={{height: '100px', backgroundColor: '#23252B', padding: '0 20px'}}>
      <div style={{position: 'absolute', top: 26, color: '#fff', zIndex: 10000, height: 25, lineHeight: '25px'}}>
        <div><img src={logo}/></div>
      </div>
      {/* 门户登录态状态条 */}
      <iframe src={'//ft.jdpay.com/account/statusbar'} id='statusbar' name='statusbar'
              style={{position: 'absolute', top: 30, right: 30, padding: 0, border: 0, backgroundColor: 'rgba(52,53,58,1)'}} width='1000px' height='30px' frameBorder='no'>
      </iframe>
    </Header>
  );

  // return (
  //   <nav className="header-nav">
  //     <a href={`${urlContext}/home`}
  //        className={classNames('header-nav-item', pathname.indexOf(`${urlContext}/home`) !== -1 ? 'active' : '')}>
  //       Home
  //     </a>
  //     <a href={`${urlContext}/page1/module1`}
  //        className={classNames('header-nav-item', pathname.indexOf(`${urlContext}/page1`) !== -1 ? 'active' : '')}>
  //       Page1
  //     </a>
  //     <a href={`${urlContext}/page2/person`}
  //        className={classNames('header-nav-item', pathname.indexOf(`${urlContext}/page2`) !== -1 ? 'active' : '')}>
  //       Page2
  //     </a>
  //     <a href={`${urlContext}/about`}
  //        className={classNames('header-nav-item', pathname.indexOf(`${urlContext}/about`) !== -1 ? 'active' : '')}>
  //       About
  //     </a>
  //     <a href={`${urlContext}/cms`}
  //        className={classNames('header-nav-item', pathname.indexOf(`${urlContext}/cms`) !== -1 ? 'active' : '')}>
  //       Cms Layout
  //     </a>
  //   </nav>
  // );
};

export default HeaderModule;
