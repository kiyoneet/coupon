import { CouponDynamodbTable } from './../../infrastructures/coupons/coupon-dynamodb-table';
import { APIGatewayEvent } from 'aws-lambda';

exports.handler = async function(event: APIGatewayEvent) {
  console.log('request:', JSON.stringify(event, undefined, 2));
  const id: string = event.pathParameters!.id;
  const data = await CouponDynamodbTable.getCoupnById(id);
  if (!data) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } else {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json'
      },
      body: 'Not found'
    };
  }
};
