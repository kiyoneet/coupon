import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import {CoupnUsecase } from './../../domains/coupons/coupon-usecase'

exports.handler = async function(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
  console.log('request:', JSON.stringify(event, undefined, 2));
  try {
    if (event.queryStringParameters === null) {
      return await CoupnUsecase.getAllCoupons();
    } else {
      if (event.queryStringParameters.title === undefined) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: 'required parameters title.'
          })
        }
      }
      const title = event.queryStringParameters.title;
      return await CoupnUsecase.searchByTitle(title);
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};