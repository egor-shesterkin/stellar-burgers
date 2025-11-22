import { FC, useMemo, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const ingredients = useSelector((store) => store.ingredients.ingredients);

  const { orders: userOrders } = useSelector((store) => store.userOrders);
  const { orders: feedOrders } = useSelector((store) => store.feed);

  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!number) {
      setLoading(false);
      return;
    }

    const orderNumber = parseInt(number, 10);

    const existingOrder = location.pathname.includes('/profile/orders')
      ? userOrders.find((order) => order.number === orderNumber)
      : feedOrders.find((order) => order.number === orderNumber);

    if (existingOrder) {
      setOrderData(existingOrder);
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getOrderByNumberApi(orderNumber);

        if (response.orders && response.orders.length > 0) {
          setOrderData(response.orders[0]);
        } else {
          setError('Order not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [number, location.pathname, userOrders, feedOrders]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading) {
    return (
      <div className='p-10'>
        <Preloader />
        <p className='text text_type_main-default text_color_inactive mt-4'>
          Загружаем детали заказа...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-10 text text_type_main-default text_color_error'>
        Ошибка: {error}
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div className='p-10 text text_type_main-default'>
        Не удалось загрузить детали заказа
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
