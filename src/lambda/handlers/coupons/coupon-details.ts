import { CouponDynamodbTable } from './../../infrastructures/coupons/coupon-dynamodb-table';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

exports.handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log('request:', JSON.stringify(event, undefined, 2));
  try {
    const id: string = event.pathParameters!.id;
    const data = await CouponDynamodbTable.getCoupnById(id);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};
