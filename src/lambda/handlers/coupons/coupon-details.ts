import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CouponUsecase } from './../../domains/coupons/coupon-usecase';

export async function handler(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  console.log('request:', JSON.stringify(event, undefined, 2));
  try {
    const id: string = event.pathParameters!.id;
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
