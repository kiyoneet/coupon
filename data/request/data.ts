import { APIGatewayProxyEvent } from 'aws-lambda';
const data: APIGatewayProxyEvent = {
  resource: '/coupons/{id}',
  path: '/coupons/hoge',
  httpMethod: 'GET',
  headers: {},
  multiValueHeaders: {},
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: {
    id: '000000'
  },
  stageVariables: null,
  requestContext: {
    resourceId: 'yaqoog',
    resourcePath: '/coupons/{id}',
    httpMethod: 'GET',
    extendedRequestId: 'dq6GkEKmNjMFtQA=',
    requestTime: '31/Jul/2019:03:25:30 +0000',
    path: '/coupons/{id}',
    accountId: '766815405900',

    stage: 'test-invoke-stage',
    domainPrefix: 'testPrefix',
    requestTimeEpoch: 1564543530051,
    requestId: 'd8f1f5eb-b342-11e9-b5a6-051734a33abc',
    identity: {
      cognitoIdentityPoolId: null,
      cognitoIdentityId: null,
      apiKey: 'test-invoke-api-key',
      cognitoAuthenticationType: null,
      userArn: 'arn:aws:iam::766815405900:user/yasumasa.takai',
      apiKeyId: 'test-invoke-api-key-id',
      userAgent:
        'aws-internal/3 aws-sdk-java/1.11.590 Linux/4.9.137-0.1.ac.218.74.329.metal1.x86_64 OpenJDK_64-Bit_Server_VM/25.212-b03 java/1.8.0_212 vendor/Oracle_Corporation',
      accountId: '766815405900',
      caller: 'AIDAJD3UPJ6ZXXCR2T2JO',
      sourceIp: 'test-invoke-source-ip',
      accessKey: 'ASIA3FCOCQ5GIJ5KVZME',
      cognitoAuthenticationProvider: null,
      user: 'AIDAJD3UPJ6ZXXCR2T2JO'
    },
    domainName: 'testPrefix.testDomainName',
    apiId: '9ni2ybgqg5'
  },
  body: null,
  isBase64Encoded: false
};
export default data;
