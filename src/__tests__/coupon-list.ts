import { handler } from '../lambda/handlers/coupons/coupon-list';
import data from '../../data/request/data';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { CouponDynamodbTable } from '../lambda/infrastructures/coupons/coupon-dynamodb-table';

const mockResult = {
  description: 'fugafuga',
  id: '0000000',
  thumnail_url: 'https://coupon-image-bucket.takai-high.com/クーポン画像.png',
  qrcode_url: 'https://coupon-image-bucket.takai-high.com/クーポンQR画像.jpg',
  title: 'hogehoge'
};

const mockGetCoupon = jest.fn();
mockGetCoupon.mockReturnValue([mockResult]);

CouponDynamodbTable.getByTitle = mockGetCoupon.bind(CouponDynamodbTable);
CouponDynamodbTable.scan = mockGetCoupon.bind(CouponDynamodbTable);

jest.mock('../lambda/infrastructures/coupons/coupon-dynamodb-table');

describe('coupon-usecase', () => {
  describe('success', () => {
    it('scan', async () => {
      const event: APIGatewayProxyEvent = data;
      event.path = '/coupons';
      event.pathParameters = null;
      event.queryStringParameters = null;
      const response = await handler(event);
      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual(
        JSON.stringify({
          data: [mockResult]
        })
      );
    });
    it('getCouponByTitle', async () => {
      const event: APIGatewayProxyEvent = data;
      event.path = '/coupons';
      event.pathParameters = null;
      event.queryStringParameters = {
        title: 'hogehoge'
      };
      const response = await handler(event);
      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual(
        JSON.stringify({
          data: [mockResult]
        })
      );
    });
  });
});
