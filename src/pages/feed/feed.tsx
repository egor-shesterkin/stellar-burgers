import { useEffect, useRef } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, total, totalToday } = useSelector(
    (store) => store.feed
  );
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && !loading) {
      dispatch(getFeeds());
      hasFetched.current = true;
    }
  }, [dispatch, loading]);

  const handleRefresh = () => {
    hasFetched.current = true;
    dispatch(getFeeds());
  };

  if (loading && orders.length === 0) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='p-10 text text_type_main-default text_color_error'>
        Ошибка загрузки ленты заказов: {error}
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleRefresh} />;
};
