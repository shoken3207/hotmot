import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import BookMarkBox from '../components/BookMarkBox';
import { styled } from 'styled-components';
import CommonTab from '../components/CommonTab';
import { PRODUCT_CATEGORIES, TABS } from '../const';
import { UserResponse } from '../types/response/UserResponse';
import useFetchData from '../hooks/useFetchData';
import { BookMarkResponse } from '../types/response/BookMarkResponse';

const test = () => {
  const user = useSelector(
    (state: RootState) => state.userData as UserResponse
  );
  const [bookMarks, setBookMarks] = useState<BookMarkResponse[]>([]);
  const [selectTab, setSelectTab] = useState<number>(PRODUCT_CATEGORIES.ALL);
  const { fetchBookMarks: fetchBookMarksFunc } = useFetchData();
  const fetchBookMarks = async () => {
    const res = await fetchBookMarksFunc({
      userId: user.id,
      categoryId: selectTab,
    });
    setBookMarks(res);
  };
  useEffect(() => {
    fetchBookMarks();
  }, [selectTab]);

  return (
    <div>
      <CommonTab
        tabs={TABS}
        selectTab={selectTab}
        setSelectTab={setSelectTab}
      />
      <SWrap>
        {bookMarks.map(
          ({
            id,
            productId,
            productName,
            productImage,
            createdAt,
            categoryId,
          }) => (
            <BookMarkBox
              id={id}
              productId={productId}
              productImage={productImage}
              productName={productName}
              createdAt={createdAt}
              categoryId={categoryId}
            />
          )
        )}
      </SWrap>
    </div>
  );
};

export default test;

const SWrap = styled.div`
  padding: 1rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;
