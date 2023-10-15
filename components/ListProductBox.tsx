import React, { useState } from 'react';
import { Rice } from '../types/jsons/Rice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from 'styled-components';
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import useBookMark from '../hooks/useBookMark';
import useFetchData from '../hooks/useFetchData';
import { login } from '../features/userData/userDataSlice';
import useCart from '../hooks/useCart';
import { useRouter } from 'next/router';
import { RICE_TYPE } from '../const';

const ListProductBox = ({
  id,
  name,
  price,
  image,
  rices,
  categoryId,
}: {
  id: number;
  name: string;
  price: number;
  image: string;
  rices: Rice[];
  categoryId: number;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addCount, setAddCount] = useState<number>(0);
  const [riceType, setRiceType] = useState<number | undefined>(
    rices.length > 0 ? rices[0].id : undefined
  );
  const { addBookMark: addBookMarkFunc, deleteBookMark: deleteBookMarkFunc } =
    useBookMark();
  const { addCartDetails: addCartDetailsFunc } = useCart();
  const { fetchUserById } = useFetchData();
  const user = useSelector((state: RootState) => state.userData);

  const addBookMark = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log('user: ', user);
    const { success } = await addBookMarkFunc({
      userId: user.id,
      productId: id,
      categoryId,
    });

    if (success && user.id) {
      const userData = await fetchUserById({ id: user.id });
      if (userData) {
        dispatch(login(userData));
      }
    }
  };

  const deleteBookMark = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const bookMark = user.bookMarks.find((x) => x.productId === id);
    if (bookMark) {
      const { success } = await deleteBookMarkFunc({
        userId: user.id,
        id: bookMark.id,
      });

      if (success && user.id) {
        const userData = await fetchUserById({ id: user.id });
        if (userData) {
          dispatch(login(userData));
        }
      }
    }
  };

  const addCartDetail = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (addCount === 0) return;
    if (user.cart && user.cart.id) {
      const { success } = await addCartDetailsFunc([
        {
          productId: id,
          quantity: addCount,
          cartId: user.cart.id,
          riceId: rices.length > 0 ? riceType : RICE_TYPE.NONE,
        },
      ]);

      if (success && user.id) {
        if (rices.length > 0) {
          setRiceType(rices[0].id);
        }
        setAddCount(0);
        const userData = await fetchUserById({ id: user.id });
        if (userData) {
          dispatch(login(userData));
        }
      }
    }
  };

  return (
    <SBox>
      <SImage onClick={() => router.push(`/ProductDetail/${id}`)}>
        <img src={image} alt='' />
      </SImage>
      <SText>
        <h3>{name}</h3>
        <h3>
          {price}円 (税抜 : {Math.ceil(price / 1.08)}円)
        </h3>
      </SText>
      {rices.length > 0 && (
        <SSelect
          onChange={(e: any) => setRiceType(parseInt(e.target.value))}
          value={riceType}
        >
          {rices.map(({ id, name, price }) => (
            <option value={id}>
              {name}　({price}円)
            </option>
          ))}
        </SSelect>
      )}
      <SAddCountEl addCount={addCount}>
        <button
          disabled={addCount <= 0}
          onClick={() => setAddCount((prev) => prev - 1)}
        >
          －
        </button>
        <input
          type='text'
          value={addCount}
          onChange={(e) => setAddCount(parseInt(e.target.value))}
        />
        <button onClick={() => setAddCount((prev) => prev + 1)}>＋</button>
      </SAddCountEl>
      <SButtonGroup>
        <SCartButton>
          <Button
            startIcon={<ShoppingCartIcon fontSize='large' />}
            onClick={(e) => addCartDetail(e)}
            variant='contained'
            color='error'
          >
            <span>
              カートに
              <br />
              入れる
            </span>
          </Button>
        </SCartButton>
        {user.bookMarks.some((x) => x.productId === id) ? (
          <IconButton color='primary' onClick={(e) => deleteBookMark(e)}>
            <StarIcon color='primary' fontSize='large' />
          </IconButton>
        ) : (
          <IconButton color='primary' onClick={(e) => addBookMark(e)}>
            <StarBorderIcon color='primary' fontSize='large' />
          </IconButton>
        )}
      </SButtonGroup>
    </SBox>
  );
};

export default ListProductBox;

const SBox = styled.div`
  /* width: 240px; */
  width: 100%;
  max-width: 330px;
  display: flex;
  flex-direction: column;
  row-gap: 0.4rem;
`;

const SImage = styled.div`
  width: 100%;
  aspect-ratio: 10 / 9;
  cursor: pointer;
  /* height: 225px; */
  border-radius: 10px;
  border: 1px solid #ccc;

  > img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
`;

const SSelect = styled.select`
  outline: none;
  margin-top: 0.4rem;
  width: 100%;
  max-width: 360px;
  padding: 0.3rem 0.5rem;
  font-weight: bold;
  border-color: #ccc;
`;

const SAddCountEl = styled.div<{
  addCount: number;
}>`
  display: flex;

  > input {
    width: 50px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #ccc;
  }

  > button {
    width: 50px;
    height: 30px;
    border: 2px solid #ed1c24;
    cursor: pointer;
    &:nth-of-type(1) {
      transition: all 0.2s;
      border: ${({ addCount }: { addCount: number }) =>
        addCount === 0 && '1px solid #ccc'};
      background-color: ${({ addCount }: { addCount: number }) =>
        addCount === 0 && 'white'};
      border-radius: 7px 0 0 7px;
    }
    &:nth-of-type(2) {
      border-radius: 0 7px 7px 0;
    }
  }
`;

const SText = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.3rem;

  h3 {
    font-size: 0.9rem;
    word-break: break-all;
    &:nth-of-type(1) {
    }
    &:nth-of-type(2) {
    }
  }
`;

const SButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const SCartButton = styled.div`
  span {
    color: white;
    font-size: 0.7rem;
  }
`;
