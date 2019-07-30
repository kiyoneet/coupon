const mockGetCouponById = jest.fn().mockReturnValue({
  id: '0000000',
  descrition: 'fugafuga',
  qrcode_url: 'https://coupon-image-bucket.takai-high.com/クーポンQR画像.jpg',
  thumnail_url: 'https://coupon-image-bucket.takai-high.com/クーポン画像.png',
  title: 'hogehoge'
});

const mockCouponDynamodbTable = jest.fn().mockImplementation(() => ({
  getCouponById: mockGetCouponById
}));

module.exports = mockCouponDynamodbTable;
