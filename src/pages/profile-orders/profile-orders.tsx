import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getUserOrders } from '../../services/slices/userOrdersSlice';
import { isAuthenticated } from '../../utils/auth';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((store) => store.userOrders);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/profile/orders' } });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (user && !loading && orders.length === 0) {
      dispatch(getUserOrders());
    }
  }, [dispatch, user, loading, orders.length]);

  if (!user) {
    return <Preloader />;
  }

  if (loading && orders.length === 0) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='p-10 text text_type_main-default text_color_error'>
        Ошибка загрузки заказов: {error}
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
