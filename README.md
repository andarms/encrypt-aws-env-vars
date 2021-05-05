# Encrypt aws lambda environment variables from config file action

This action take a lambda config file and output a new file with the encrypted variables values

## Inputs

### `aws-region`

**Required** the aws region of the lambda and the cmk

### `aws-cmk-arn`

**Required** the arn for the cmk resource created in aws which will be used to encrypt and decrypt the env vars

### `config-file-location`

**Required** the path for the lambda config file which contains the plain env var values.

## Outputs

### `encrypted-file-location`

The path for the encrypted file.

## Example usage

```yml
uses: actions/encrypt-aws-env-vars@v1
with:
  aws-region: "sa-east-1"
  aws-cmk-arn: "arn:aws:kms:sa-east-1:..."
  config-file-location: "/config/lambda.config.json"
  aws-access-key-id: "ASK..."
  aws-secret-access-key: "ASK..."
```
