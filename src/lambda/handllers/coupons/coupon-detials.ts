import {CouponDynamodbTable}   from '../../infrastructures/coupons/coupon-dynamodb-table'
exports.handler = async (event: any) => {
    const id: string = event.params.id; 
    const results = await CouponDynamodbTable.getCouponDetails(id);
        return results

}