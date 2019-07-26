import * as AWS from 'aws-sdk';

import {
  DocumentClient,
  ScanOutput,
  QueryOutput,
  GetItemOutput
} from 'aws-sdk/clients/dynamodb';

const TABLE_NAME = process.env.TABLE_NAME!;
const dynamoClient: DocumentClient = new AWS.DynamoDB.DocumentClient();

export class CouponDynamodbTable {
  public static async getCoupnById(id: string): Promise<GetItemOutput> {
    const param: DocumentClient.GetItemInput = {
      TableName: TABLE_NAME,
      Key: { id }
    };
    return await dynamoClient.get(param).promise();
  }

  public static async getByTitle(title: string): Promise<QueryOutput> {
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
    return await dynamoClient.query(param).promise();
  }
  public static async scan(exclusiveStartKey?: {}): Promise<ScanOutput> {
    const param: DocumentClient.ScanInput = {
      TableName: TABLE_NAME
    };
    if (exclusiveStartKey) {
      param.ExclusiveStartKey = exclusiveStartKey;
    }

    return await dynamoClient.scan(param).promise();
  }
}
