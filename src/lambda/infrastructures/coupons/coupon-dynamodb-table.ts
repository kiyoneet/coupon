import * as AWS from 'aws-sdk';
import { Coupon } from '../../domains/coupons/coupon'
import { DataMapper } from '@aws/dynamodb-data-mapper'
const REGION = process.env.REGION;
const TABLE_NAME = process.env.TABLE_NAME;
const DynamoDB = new AWS.DynamoDB({
    apiVersion: '2012-10-08',
    region: REGION
})

const mapper = new DataMapper({
  client: DynamoDB
})


export class CouponDynamodbTable {
    /**
     * getCouponDetails
id: string : Promise<Coupon>    */
    public static async getCouponDetails(id: string): Promise<Coupon> {
        const result : Coupon = await  mapper.get(Object.assign(new Coupon, {
            id: id,
        }))
        return result 
    }
}