import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { parseTargetUrl } from "./parse-target-url.mjs";

const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
  const code = event.pathParameters?.code;

  if (!code) {
    return { statusCode: 400, body: "Missing short code" };
  }

  try {
    const { Item } = await ddb.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: { shortCode: code },
      }),
    );

    if (!Item) {
      return { statusCode: 404, body: "Link not found" };
    }

    const url = parseTargetUrl(Item.longUrl);
    if (!url) {
      return { statusCode: 404, body: "Link not found" };
    }
    const location = url.href;

    try {
      await ddb.send(
        new UpdateCommand({
          TableName: process.env.TABLE_NAME,
          Key: { shortCode: code },
          UpdateExpression: "ADD clickCount :inc",
          ExpressionAttributeValues: { ":inc": 1 },
        }),
      );
    } catch (error) {
      console.error("Unable to increase click count:", error);
    }

    return {
      statusCode: 302,
      headers: { Location: location, "Referrer-Policy": "no-referrer" },
      body: "",
    };
  } catch (error) {
    console.error("Unable to retrieve data:", error);
    return { statusCode: 500, body: "Internal server error" };
  }
};
