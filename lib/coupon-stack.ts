import cdk = require('@aws-cdk/core');
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { Duration } from '@aws-cdk/core';
import { Props, StaticSiteConstruct } from './stactic-site-construct';
import { GlobalSecondaryIndexProps } from '@aws-cdk/aws-dynamodb';
export class CouponStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const couponTable = new dynamodb.Table(this, 'coupon', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      tableName: 'coupon'
    });
    const gsiProps: GlobalSecondaryIndexProps = {
      indexName: 'title',
      partitionKey: {
        name: 'title',
        type: dynamodb.AttributeType.STRING
      }
    };
    couponTable.addGlobalSecondaryIndex(gsiProps);

    const getCouponList = new lambda.Function(this, 'getCouponList', {
      code: new lambda.AssetCode('src/lambda'),
      handler: 'handlers/coupons/coupon-list.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: Duration.seconds(3),
      environment: {
        TABLE_NAME: 'coupon'
      }
    });
    const getCouponDetails = new lambda.Function(this, 'getCouponDetails', {
      code: new lambda.AssetCode('src/lambda'),
      handler: 'handlers/coupons/coupon-details.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: Duration.seconds(3),
      environment: {
        TABLE_NAME: 'coupon'
      }
    });
    
    couponTable.grantReadData(getCouponDetails);
    couponTable.grantReadData(getCouponList);

    const restApi = new apigateway.RestApi(this, 'CouponApi', {
      restApiName: 'coupon-api'
    });
    const rootResouce = restApi.root.addResource('coupons');
    const getCouponListIntegration = new apigateway.LambdaIntegration(
      getCouponList
    );
    rootResouce.addMethod('GET', getCouponListIntegration);
    addCorsOptions(rootResouce);

    const idResource = rootResouce.addResource('{id}');
    const getCouponDetailsIntegration = new apigateway.LambdaIntegration(
      getCouponDetails
    );
    idResource.addMethod('GET', getCouponDetailsIntegration);
    addCorsOptions(idResource);

    const thumnailBucketProps: Props = {
      domain: this.node.tryGetContext('domain'),
      subdomain: this.node.tryGetContext('subdomain'),
      acmArn: this.node.tryGetContext('acmArn')
    };
    new StaticSiteConstruct(this, 'thumnailDeliverySite', thumnailBucketProps);
  }
}

export function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod(
    'OPTIONS',
    new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers':
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials':
              "'false'",
            'method.response.header.Access-Control-Allow-Methods':
              "'OPTIONS,GET,PUT,POST,DELETE'"
          }
        }
      ],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}'
      }
    }),
    {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Origin': true
          }
        }
      ]
    }
  );
}
