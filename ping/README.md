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

## Deploy

Using [Serverless Framework](https://serverless.com/ "Serverless Framework")

    sls deploy

## Testing

    sls invoke -f create