import React from 'react';
import { OrderHistoryResponse } from '../types/response/OrderHistoryResponse';
import { styled } from 'styled-components';
import { useRouter } from 'next/router';

const OrderDetailHistoryBox = ({
  productId,
  productImage,
  productName,
  price,
  quantity,
  riceName,
}: {
  productId: number;
  productName: string;
  productImage: string;
  riceName: string;
  quantity: number;
  price: number;
}) => {
  const router = useRouter();
  return (
    <SBox>
      <SImage onClick={() => router.push(`/ProductDetail/${productId}`)}>
        <img src={productImage} alt='' />
      </SImage>
      <SRight>
        <h2>{productName}</h2>
        <h3>{riceName}</h3>
        <h4>
          {price}円 (税抜 : {Math.ceil(price / 1.08)}円)
        </h4>
        <h4>購入数: {quantity}</h4>
      </SRight>
    </SBox>
  );
};

export default OrderDetailHistoryBox;

const SBox = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.4rem 0.3rem;
  border-bottom: 3px solid #ccc;

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

const SImage = styled.div`
  width: 35%;
  cursor: pointer;
  @media (max-width: 400px) {
    width: 100%;
  }

  > img {
    width: 100%;
    height: 100%;
  }
`;

const SRight = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  row-gap: 0.4rem;

  @media (max-width: 400px) {
    width: 100%;
  }
`;
