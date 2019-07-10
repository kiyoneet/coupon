# coupon
## 概要
小売店向けのクーポン配信用アプリのWebAPIです。

HTTP/GETでクーポンの以下の情報が取得できます。

取得できるデータは以下です。
- クーポンの画像
- クーポンのQRコード画像
- クーポンデータ
    - ID：7桁ゼロ埋め数値（例：0001245）
    - タイトル：20文字以内の文字列（例：【秋葉原店】全商品 10% OFF！）
    - 説明文：100文字以内の文字列（例：ご利用一回限り。他のクーポンとの併用はできません。クーポンをご利用いただいた場合、ポイントはつきません)

クーポンのタイトルで指定ワード検索をすることができます。

## Dynamo

|Key|SortKey|Value|
|---|---|---|
|0000001|unixtime|{title:'hogehoge',description:'fugafuga',image:;'s3://***/00000001_{unixtime}_coupon.png',qr_code:'s3://***/0000001_{unixtime}_qrcode.jpg'}|

## S3

```
root
  |_0000001_{unixtime}_coupon.png
  |_0000001_{unixtime}_qrcode.jpg
  |_0000002_***
```

## APIGateway

[Swagger](./swagger.yaml)参照