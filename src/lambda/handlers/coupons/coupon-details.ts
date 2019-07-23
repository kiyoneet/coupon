// import {CouponDynamodbTable}   from '../../infrastructures/coupons/coupon-dynamodb-table'
// exports.handler = async (event: any) => {
//     const id: string = event.params.id;
//     const results = await CouponDynamodbTable.getCouponDetails(id);
//         return results

// }

exports.handler = async function(event: any) {
  console.log('request:', JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: `Hello, CDK! You've hit ${event.path}`
  };
};
