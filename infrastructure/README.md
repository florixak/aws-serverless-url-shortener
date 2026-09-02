## Lambda execution role

The project uses two separate IAM roles (principle of least privilege).

## Architecture

- **API Gateway** – HTTP API, two routes (POST /links, GET /{code})
- **Lambda** – two functions (createLink, redirectLink), runtime Node.js 22.x
- **DynamoDB** – `links-table` table, partition key `shortCode` (String)

### create-link-role
Used by the `createLink` function.

| Action | Service | Reason |
|---|---|---|
| `dynamodb:PutItem` | DynamoDB | Write a new short link |

See `iam/create-link-role-policy.json`

### redirect-link-role
Used by the `redirectLink` function.

| Action | Service | Reason |
|---|---|---|
| `dynamodb:GetItem` | DynamoDB | Read the link on redirect |
| `dynamodb:UpdateItem` | DynamoDB | Increment the click counter |

See `iam/redirect-link-role-policy.json`
