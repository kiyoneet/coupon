import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets/lib';
import { Construct, CfnOutput } from '@aws-cdk/core';
import { HostedZoneProps } from '@aws-cdk/aws-route53';

export interface Props {
  domain: string;
  subdomain: string;
  acmArn: string;
  zoneId?: string;
}

export class StaticSiteConstruct extends Construct {
  constructor(parent: Construct, name: string, props: Props) {
    super(parent, name);
    const siteName = `${props.subdomain}.${props.domain}`;

    const siteBucket = new s3.Bucket(this, 'Sitebucket', {
      bucketName: siteName,
      publicReadAccess: true
    });
    new CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

    // そいえばCloudFrontはuseast-1しかダメじゃん。。。
    // const certificateArn = new acm.Certificate(this, 'ArnParameter', {
    //   domainName: props.domain
    // }).certificateArn;ß

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'SiteDistribution',
      {
        aliasConfiguration: {
          acmCertRef: props.acmArn,
          names: [siteName],
          sslMethod: cloudfront.SSLMethod.SNI,
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2018
        },
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
            },
            behaviors: [{ isDefaultBehavior: true }],

          }
        ],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL
      }
    );
    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId
    });

    // const zoneProps: HostedZoneProps = {
    //   zoneName: props.domain
    // }

    // const zone = new route53.HostedZone(this, 'HotedZoneName', {
    //   zoneName: props.domain,
    // });
    // new route53.ARecord(this, 'SiteAliasRecord', {
    //   recordName: siteName,
    //   target: route53.AddressRecordTarget.fromAlias(
    //     new targets.CloudFrontTarget(distribution)
    //   ),
    //   zone
    // });
  }
}
