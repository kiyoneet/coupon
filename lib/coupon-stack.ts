import cdk = require('@aws-cdk/core');
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda  from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { Duration } from '@aws-cdk/core';
export class CouponStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const couponTable = new dynamodb.Table(this, 'coupon', {
      partitionKey: {
          name: 'id',
          type: dynamodb.AttributeType.STRING
      },
      tableName: 'coupon'
    })

    const getCouponItemLambda = new lambda.Function(this, 'getCoupnItemLambda', {
      code: lambda.Code.asset('src/lambda'),
      handler: 'coupon.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: Duration.seconds(3),
      environment: {
        COUPON_TABLE_NAME: couponTable.tableName,
      }
    })

    couponTable.grantReadData(getCouponItemLambda)
    
    const restApi = new apigateway.RestApi(this, 'CouponApi', {
      restApiName: 'coupon-api'
    })
    const couponResource = restApi.root.addResource('coupons')
    const getCouponItemIntegration = new apigateway.LambdaIntegration(
      getCouponItemLambda,
      {
          proxy: false,
          integrationResponses: [
              {
                  statusCode: '200',
                  responseTemplates: {
                      'application/json': '$input.json("$")'
                  }
              }
          ],
          passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
          requestTemplates: {
              'application/json': '$input.json("$")'
          },
      }
    )
    couponResource.addMethod(
      'Get',
      getCouponItemIntegration,
      {methodResponses: [{statusCode: '200',}]});
      




    // The code that defines your stack goes here
  }
}
