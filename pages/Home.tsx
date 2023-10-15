import React, { useState, useEffect } from 'react';
import { ListProduct } from '../types/jsons/expansion/ListProduct';
import { fetchProductsByCategory } from '../utils/master';
import { PRODUCT_CATEGORIES, TABS } from '../const';
import ListProductBox from '../components/ListProductBox';
import { styled } from 'styled-components';
import CommonTab from '../components/CommonTab';

const Home = () => {
  const [productList, setProductList] = useState<ListProduct[]>([]);
  const [selectTab, setSelectTab] = useState(PRODUCT_CATEGORIES.BENTO);
  useEffect(() => {
    const products = fetchProductsByCategory(selectTab);
    console.log('products: ', products);
    setProductList(products);
  }, [selectTab]);
  return (
    <div>
      <CommonTab
        tabs={TABS}
        selectTab={selectTab}
        setSelectTab={setSelectTab}
      />
      <SContainer>
        <SList>
          {productList.map(({ id, name, price, image, rices, categoryId }) => (
            <ListProductBox
              key={id}
              id={id}
              name={name}
              price={price}
              image={image}
              rices={rices}
              categoryId={categoryId}
            />
          ))}
        </SList>
      </SContainer>
    </div>
  );
};

export default Home;

const SContainer = styled.div`
  padding: 1.5rem;
`;

const SList = styled.div`
  /* display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 2rem; */
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;
