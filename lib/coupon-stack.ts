import cdk = require('@aws-cdk/core');
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { Duration, listMapper } from '@aws-cdk/core';
import { Props, StaticSiteConstruct } from './stactic-site-construct';
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

    const getCouponList = new lambda.Function(this, 'getCouponList', {
      code: new lambda.AssetCode('src/lambda/handlers/coupons'),
      handler: 'coupon-list.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: Duration.seconds(3)
    });
    const getCouponDetails = new lambda.Function(this, 'getCouponDetails', {
      code: new lambda.AssetCode('src/lambda/handlers/coupons'),
      handler: 'coupon-details.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: Duration.seconds(3)
    });
    const getCouponQrcode = new lambda.Function(this, 'getCouponQrcode', {
      code: new lambda.AssetCode('src/lambda/handlers/coupons'),
      handler: 'coupon-qrcode.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: Duration.seconds(3)
    });
    couponTable.grantReadData(getCouponDetails);
    couponTable.grantReadData(getCouponList);
    couponTable.grantReadData(getCouponQrcode);

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

    const qrcodeResource = idResource.addResource('qrcode');
    const getCouponQrcodeIntegration = new apigateway.LambdaIntegration(
      getCouponQrcode
    );
    qrcodeResource.addMethod('GET', getCouponQrcodeIntegration);
    addCorsOptions(qrcodeResource);

    const thumnailBucketProps: Props = {
      domain: this.node.tryGetContext('domain'),
      subdomain: this.node.tryGetContext('subdomain'),
      acmArn: this.node.tryGetContext('acmarn')
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
