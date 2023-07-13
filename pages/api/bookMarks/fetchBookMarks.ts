import type { NextApiRequest, NextApiResponse } from 'next';
import { createBookMarksResponse } from '../../../utils/createResponse';
import { FetchBookMarksRequest } from '../../../types/requests/FetchBookMarksRequest';
import {
  fetchBookMarksByUserId,
  fetchCategoryBookMarksByUserId,
} from '../../../services/bookMarkService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userId, categoryId } = req.query as FetchBookMarksRequest;
    console.log('userId: ', userId);
    const parseUserId = parseInt(userId);

    if (!parseUserId)
      return res.status(404).json({ message: 'パラメータに異常があります。' });

    let bookMarks;
    if (categoryId) {
      const parseCategoryId = parseInt(categoryId);
      bookMarks = await fetchCategoryBookMarksByUserId({
        userId: parseUserId,
        categoryId: parseCategoryId,
      });
    } else {
      bookMarks = await fetchBookMarksByUserId(parseUserId);
    }

    if (bookMarks.length === 0)
      return res.status(404).json({ message: 'お気に入りがありません。' });

    const responseBookMarks = await createBookMarksResponse(bookMarks);
    res.status(200).json({ bookMarks: responseBookMarks, message: '' });
  } catch (err) {
    return res.status(500).json({ err });
  }
};
