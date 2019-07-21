import {
    attribute,
    hashKey,
    rangeKey,
    table,
  } from '@aws/dynamodb-data-mapper-annotations'

  @table('Coupons')
  export class Coupon {
      @hashKey()    
      id : string

      @rangeKey( {defaultProvider: () => new Date()})
      createAt: Date

      @attribute({
          indexKeyConfigurations: {
              ItemIdIndex: 'RANGE'
          }
      })
      title: string;

      @attribute()
      descrition: string;

      @attribute()
      thumnailUrl: string;

      @attribute()
      qrcodeUrl: string;

  }
