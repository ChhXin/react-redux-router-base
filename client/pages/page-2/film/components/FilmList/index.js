import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import style from './style.scss';
const cx = classNames.bind(style);

const FilmList = ({film, activeTab}) => {
  const allFilmList = film.get('all');
  const popularityFilmList = film.get('popularity');

  const filmList = activeTab === 'all' ? allFilmList : popularityFilmList;

  if (!filmList) {
    return null;
  } else if (filmList && filmList.size === 0) {
    return (
      <div className={cx('no-items')}>
        <div className={cx('no-items-icon')}></div>
        <p>暂无记录</p>
      </div>
    );
  }

  return (
    <ul className="list list-border">
      {
        // item 是每条记录，index 下标值，list 所有数据
        filmList.map((item, index, list) => {
          return (
            <li key={item.get('id')} className="list-item">
              <a href={item.get('link')} target="_blank">{item.get('name')}</a>
            </li>
          );
        })
      }
    </ul>
  );
};

FilmList.propTypes = {
  film: PropTypes.object,
  activeTab: PropTypes.string,
};

export default FilmList;
