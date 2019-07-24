import * as AWS from 'aws-sdk';
import { CouponItem } from '../../domains/coupons/coupon';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const TABLE_NAME = process.env.TABLE_NAME;
const dynamoClient: DocumentClient = new AWS.DynamoDB.DocumentClient();

export class CouponDynamodbTable {
  /**
     * getCoupnById
id: string : Promise<Coupon>    */
  public static async getCoupnById(id: string): Promise<CouponItem> {
    const param: DocumentClient.GetItemInput = {
      TableName: TABLE_NAME!,
      Key: { id }
    };
    const record: DocumentClient.GetItemOutput = await dynamoClient
      .get(param)
      .promise();
    return record.Item as CouponItem;
  }

  //   /**
  //    * scanCoupons
  //    */
  //   public static async scanCoupons(lastEvalationKey?: {}): Promise<any> {
  //     const data =  await mapper.scan(Coupon);
  //     if (data.)
  //   }

  //   public static async filterByTitle(title: string) {}
}
