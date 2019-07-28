import { APIGatewayProxyResult } from 'aws-lambda';
import { CouponDynamodbTable } from './../../infrastructures/coupons/coupon-dynamodb-table';
import {
  ScanOutput,
  QueryOutput,
  GetItemOutput
} from 'aws-sdk/clients/dynamodb';
export class CoupnUsecase {
  public static async getAllCoupons(): Promise<APIGatewayProxyResult> {
    let data: ScanOutput = await CouponDynamodbTable.scan();
    let items = data.Items;
    while (data.LastEvaluatedKey) {
      data = await CouponDynamodbTable.scan(data.LastEvaluatedKey);
      Array.prototype.push(items, data.Items);
    }
    const result: APIGatewayProxyResult = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data: items})
    };
    return result;
  }

  public static async getCouponDetails(
    id: string
  ): Promise<APIGatewayProxyResult> {
    const data: GetItemOutput = await CouponDynamodbTable.getCoupnById(id);
    const result: APIGatewayProxyResult = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        data.Item
      )
    }
    return result;
  }

  public static async searchByTitle(
    title: string
  ): Promise<APIGatewayProxyResult> {
    const data: QueryOutput = await CouponDynamodbTable.getByTitle(title);
    const result: APIGatewayProxyResult = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data: data.Items})
    };
    return result;
  }
}
