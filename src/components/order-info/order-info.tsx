import { FC, useMemo, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector((store) => store.ingredients.ingredients);
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!number || hasFetched.current) {
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const orderNumber = parseInt(number, 10);
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
    hasFetched.current = true;
  }, [number]);

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
