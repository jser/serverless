# ping

ping server is for [jser/ping](https://github.com/jser/ping "jser/ping: ping! your issus").

## Features

- Create GitHub Issue from API(API Gateway)
    - Anonymous create an issue

## Usage

Create `secret.json` in this directory

```json
{
  "repo": "jser/ping",
  "GitHubToken": "xxxasjdajsjdsaljasdkjahsdjkhxxxx"
}
```

### API

API Post Body:

```json
{
  "url": "https://jser.info",
  "description": "短いメッセージ",
  "user": "@azu"
}
```

JavaScript:

```js
var xhr = new XMLHttpRequest();
xhr.onload = () => {
    console.log(xhr);
};
xhr.open("POST", "API/ping/create");
xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
var data = {
    "url": "https://jser.info",
    "description": "短いメッセージ",
    "user": "@azu"
};
xhr.send(JSON.stringify(data));
```

## Deploy

Using [Serverless Framework](https://serverless.com/ "Serverless Framework")

    npm run deploy

## Testing

    npm run invoke
    
## FAQ

> Stack:arn:aws:cloudformation:ap-northeast-1:xxx:stack/ping-prod/bbxxxs in DELETE_FAILED state and can not be updated.

DELETE中にcloudformationが詰まった。
cloudformationで削除する


>   An error occurred: CreateLogGroup - /aws/lambda/ping-prod-create already exists.

CloudWatchのロググループが更新できないバグ