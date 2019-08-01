import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CouponUsecase } from './../../domains/coupons/coupon-usecase';

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log('request:', JSON.stringify(event, undefined, 2));
  try {
    if (event.pathParameters === null) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Badrequest.' })
      };
    }
    const id = event.pathParameters!.id;
    return await CouponUsecase.getCouponDetails(id);
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
}
