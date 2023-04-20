import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { v1 as uuid } from 'uuid'
const client = new DynamoDBClient({})
const dynamodb = DynamoDBDocumentClient.from(client)

const tableName = process.env.CAMPAIGN_ACTIVITY_TABLE

export const handler = async (event) => {
  const { queryStringParameters: queryParams } = event
  const { CampaignName, AccountId, ContactId, LeadId, UserToken } = queryParams

  if (!CampaignName || !UserToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'CampaignName and UserToken are required query parameters.',
      }),
    }
  }

  if (
    (!AccountId && !ContactId && !LeadId) ||
    (AccountId && !/^[a-zA-Z0-9]{15,18}$/.test(AccountId)) ||
    (ContactId && !/^[a-zA-Z0-9]{15,18}$/.test(ContactId)) ||
    (LeadId && !/^[a-zA-Z0-9]{15,18}$/.test(LeadId))
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid AccountId, ContactId, or LeadId.',
      }),
    }
  }

  const params = {
    TableName: tableName,
    Item: {
      id: uuid(),
      CampaignName,
      AccountId,
      ContactId,
      LeadId,
      UserToken,
    },
  }

  try {
    const data = await dynamodb.send(new GetCommand(params))
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Activity added successfully.' }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
}
