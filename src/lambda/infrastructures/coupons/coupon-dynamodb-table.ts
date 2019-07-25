import * as AWS from 'aws-sdk';
import { CouponItem } from '../../domains/coupons/coupon';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const TABLE_NAME = process.env.TABLE_NAME!;
const dynamoClient: DocumentClient = new AWS.DynamoDB.DocumentClient();

export class CouponDynamodbTable {
  /**
     * getCoupnById
id: string : Promise<Coupon>    */
  public static async getCoupnById(id: string): Promise<CouponItem> {
    const param: DocumentClient.GetItemInput = {
      TableName: TABLE_NAME,
      Key: { id }
    };
    const record: DocumentClient.GetItemOutput = await dynamoClient
      .get(param)
      .promise();
    return record.Item as CouponItem;
  }

  public static async getByTitle(title: string): Promise<any> {
    const param: DocumentClient.QueryInput = {
      TableName: TABLE_NAME,
      IndexName: 'title',
      KeyConditionExpression: '#p = :hkey',
      ExpressionAttributeNames: {
        '#p': 'title'
      },
      ExpressionAttributeValues: {
        ':hkey': title
      }
    };
    const record: DocumentClient.QueryOutput = await dynamoClient
      .query(param)
      .promise();
    console.log(record);
    return record.Items;
  }
  public static async list(): Promise<any> {
    const param: DocumentClient.ScanInput = {
      TableName: TABLE_NAME
    };
    let records: DocumentClient.ScanOutput = await dynamoClient
      .scan(param)
      .promise();
    let items = records.Items;
    while (records.LastEvaluatedKey) {
      records = await dynamoClient
        .scan(
          Object.assign(param, { ExculusiveStartKey: records.LastEvaluatedKey })
        )
        .promise();
      items = items!.concat(records.Items!);
    }
    return items;
  }
}
