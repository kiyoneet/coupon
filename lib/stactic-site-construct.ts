import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets/lib';
import { Construct, CfnOutput } from '@aws-cdk/core';

export interface Props {
  domain: string;
  subdomain: string;
  acmArn: string;
}

export class StaticSiteConstruct extends Construct {
  constructor(parent: Construct, name: string, props: Props) {
    super(parent, name);
    const siteName = `${props.subdomain}.${props.domain}`;

    const siteBucket = new s3.Bucket(this, 'Sitebucket', {
      bucketName: siteName,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true
    });
    new CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

    // そいえばCloudFrontはuseast-1しかダメじゃん。。。
    // const certificateArn = new acm.Certificate(this, 'ArnParameter', {
    //   domainName: props.domain
    // }).certificateArn;

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'SiteDistribution',
      {
        aliasConfiguration: {
          acmCertRef: props.acmArn,
          names: [siteName],
          sslMethod: cloudfront.SSLMethod.SNI,
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016
        },
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket
            },
            behaviors: [{ isDefaultBehavior: true }]
          }
        ]
      }
    );
    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId
    });
    const zone = new route53.HostedZone(this, 'HotedZoneName', {
      zoneName: props.domain
    });
    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: siteName,
      target: route53.AddressRecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone
    });
  }
}
