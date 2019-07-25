import { APIGatewayEvent } from 'aws-lambda';
import { CouponDynamodbTable } from './../../infrastructures/coupons/coupon-dynamodb-table';
import { stringLiteral } from '@babel/types';

exports.handler = async function(event: APIGatewayEvent) {
  console.log('request:', JSON.stringify(event, undefined, 2));
  try {
    if (event.queryStringParameters === null) {
      const result = await CouponDynamodbTable.list();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
      };
    } else {
      const title = event.queryStringParameters.title;
      const result = await CouponDynamodbTable.getByTitle(title);
      return {
        statusCode: 200,
        header: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};
