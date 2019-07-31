import { APIGatewayProxyResult } from 'aws-lambda';
import { CouponDynamodbTable } from './../../infrastructures/coupons/coupon-dynamodb-table';

export class CouponUsecase {
  public static async getAllCoupons(): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: await CouponDynamodbTable.scan()
      })
    };
    return result;
  }

  public static async getCouponDetails(
    id: string
  ): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(await CouponDynamodbTable.getCoupnById(id))
    };
    return result;
  }

  public static async searchByTitle(
    title: string
  ): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: await CouponDynamodbTable.getByTitle(title)
      })
    };
    return result;
  }
}
