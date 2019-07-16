#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CouponStack } from '../lib/coupon-stack';

const app = new cdk.App();
new CouponStack(app, 'CouponStack');
