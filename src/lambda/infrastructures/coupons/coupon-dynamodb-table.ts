import * as AWS from 'aws-sdk';

import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const TABLE_NAME = process.env.TABLE_NAME!;
const dynamoClient: DocumentClient = new AWS.DynamoDB.DocumentClient();

export class CouponDynamodbTable {
  public static async getCoupnById(id: string): Promise<any> {
    const param: DocumentClient.GetItemInput = {
      TableName: TABLE_NAME,
      Key: { id }
    };
    const result = await dynamoClient.get(param).promise();
    return result.Item;
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
    const result = await dynamoClient.query(param).promise();
    return result.Items;
  }
  public static async scan(): Promise<any> {
    const param: DocumentClient.ScanInput = {
      TableName: TABLE_NAME
    };
    let result = await dynamoClient.scan(param).promise();
    let items = result.Items;
    while (result.LastEvaluatedKey) {
      result = await dynamoClient
        .scan(
          Object.assign(param, { ExclusiveStartKey: result.LastEvaluatedKey })
        )
        .promise();
      Array.prototype.push(items, result.Items);
    }

    return items;
  }
}
