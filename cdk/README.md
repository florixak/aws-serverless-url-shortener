# CDK — URL Shortener Infrastructure

Deploys the URL shortener backend to AWS using the AWS CDK (TypeScript).

## Architecture

- **API Gateway** – HTTP API, two routes (`POST /links`, `GET /{code}`)
- **Lambda** – two functions (`createLink`, `redirectLink`), runtime Node.js 22.x, bundled individually with esbuild via `NodejsFunction`
- **DynamoDB** – `links-table` table, partition key `shortCode` (String), removal policy `RETAIN`

## Project layout

```
cdk/
├── bin/
│   └── cdk.ts                  # Entry point — creates App + Stack
├── handlers/
│   ├── create-lambda.mjs       # POST /links handler
│   ├── redirect-lambda.mjs     # GET /{code} handler
│   └── parse-target-url.mjs    # Shared URL validation utility
├── lib/
│   └── url-shortener-stack.ts  # Stack definition (all AWS resources)
└── cdk.json                    # CDK CLI configuration
```

## IAM — Principle of Least Privilege

IAM roles are managed by CDK automatically. Each Lambda has its own execution role with only the permissions it needs.

| Function | Permissions granted |
|---|---|
| `createLink` | `dynamodb:PutItem` on `links-table` |
| `redirectLink` | `dynamodb:GetItem`, `dynamodb:UpdateItem` on `links-table` |

Roles are created via `table.grantWriteData(createFn)` and `table.grantReadWriteData(redirectFn)` in `url-shortener-stack.ts`. No manual IAM JSON required.

## Deploy

```bash
# First time only — bootstraps CDK in your AWS account/region
cdk bootstrap

# Preview changes without deploying
cdk diff

# Deploy to AWS
cdk deploy
```

The API Gateway URL is printed as a stack output after a successful deploy.

## Destroy

```bash
cdk destroy
```

The DynamoDB table is **not** deleted on destroy (`removalPolicy: RETAIN`). It must be removed manually from the AWS Console if needed.
