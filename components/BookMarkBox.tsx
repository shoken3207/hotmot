import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from 'styled-components';
import { RootState } from '../app/store';
import useBookMark from '../hooks/useBookMark';
import useFetchData from '../hooks/useFetchData';
import { login } from '../features/userData/userDataSlice';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { IconButton } from '@mui/material';

const BookMarkBox = ({
  productId,
  productName,
  productImage,
  categoryId,
  createdAt,
  id,
}: {
  id: number;
  productId: number;
  productName: string;
  categoryId: number;
  productImage: string;
  createdAt: Date;
}) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userData);

  const { addBookMark: addBookMarkFunc, deleteBookMark: deleteBookMarkFunc } =
    useBookMark();
  const { fetchUserById } = useFetchData();
  const dispatch = useDispatch();
  const addBookMark = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { success } = await addBookMarkFunc({
      userId: user.id,
      productId: productId,
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
    const bookMark = user.bookMarks.find((x) => x.productId === productId);
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
  return (
    <SBox>
      <SImage onClick={() => router.push(`/ProductDetail/${productId}`)}>
        <img src={productImage} alt='' />
      </SImage>
      <SBoxButtom>
        <h3>{productName}</h3>
        {user.bookMarks.some((x) => x.productId === productId) ? (
          <IconButton
            size='small'
            color='primary'
            onClick={(e) => deleteBookMark(e)}
          >
            <StarIcon color='primary' fontSize='large' />
          </IconButton>
        ) : (
          <IconButton
            size='small'
            color='primary'
            onClick={(e) => addBookMark(e)}
          >
            <StarBorderIcon color='primary' fontSize='large' />
          </IconButton>
        )}
      </SBoxButtom>
    </SBox>
  );
};

export default BookMarkBox;

const SBox = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
`;

const SImage = styled.div`
  width: 100%;
  aspect-ratio: 10 / 9;
  border-radius: 10px;
  cursor: pointer;

  > img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
`;

const SBoxButtom = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  > h3 {
    width: 80%;
    word-break: break-all;
    font-size: 1.1rem;
  }
`;
