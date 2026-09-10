import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomBytes } from "crypto";
import { parseTargetUrl } from "./parse-target-url.mjs";

const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient);

const generateCode = () => randomBytes(4).toString("base64url").slice(0, 7);

async function handler(event) {
  let body;

  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const url = parseTargetUrl(body.url);

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid target URL" }),
    };
  }

  const code = generateCode();
  const tableName = process.env.TABLE_NAME;
  const baseUrl = process.env.BASE_URL;

  try {
    await ddb.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          shortCode: code,
          longUrl: url.href,
          createdAt: new Date().toISOString(),
          clickCount: 0,
        },
      }),
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ shortCode: code, shortUrl: `${baseUrl}/${code}` }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not save item" }),
    };
  }
}

export { handler };
