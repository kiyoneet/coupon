import { handler } from '../lambda/handlers/coupons/coupon-details';
import data from '../../data/request/data';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { CouponDynamodbTable } from '../lambda/infrastructures/coupons/coupon-dynamodb-table';

const mockResultGetCouponById = {
  description: 'fugafuga',
  id: '0000000',
  thumnail_url: 'https://coupon-image-bucket.takai-high.com/クーポン画像.png',
  qrcode_url: 'https://coupon-image-bucket.takai-high.com/クーポンQR画像.jpg',
  title: 'hogehoge'
};
const mockGetCouponById = jest.fn();
mockGetCouponById.mockReturnValue(mockResultGetCouponById);

CouponDynamodbTable.getCoupnById = mockGetCouponById.bind(CouponDynamodbTable);

jest.mock('../lambda/infrastructures/coupons/coupon-dynamodb-table');

describe('coupon-usecase', () => {
  describe('success', () => {
    it('getCouponDetails', async () => {
      const event: APIGatewayProxyEvent = data;

      event.pathParameters = { id: '0000000' };
      const response = await handler(event);
      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual(JSON.stringify(mockResultGetCouponById));
    });
  });
  describe('error', () => {
    it('getCouponDetials', async () => {
      const event: APIGatewayProxyEvent = data;
      event.pathParameters = null;
      const response = await handler(event);
      expect(response.statusCode).toBe(400);
    });
  });
});
