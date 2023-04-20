import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v1 as uuid } from 'uuid'

const client = new DynamoDBClient({})
const dynamodb = DynamoDBDocumentClient.from(client)

const tableName = process.env.CAMPAIGN_ACTIVITY_TABLE

const buildResponse = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ message: message }),
  }
}

export const handler = async (event) => {
  const { queryStringParameters: queryParams } = event
  const { CampaignName, AccountId, ContactId, LeadId, UserToken } = queryParams

  if (!CampaignName || !UserToken) {
    return buildResponse(
      400,
      'CampaignName and UserToken are required query parameters.',
    )
  }

  if (
    (!AccountId && !ContactId && !LeadId) ||
    (AccountId && !/^[a-zA-Z0-9]{15,18}$/.test(AccountId)) ||
    (ContactId && !/^[a-zA-Z0-9]{15,18}$/.test(ContactId)) ||
    (LeadId && !/^[a-zA-Z0-9]{15,18}$/.test(LeadId))
  ) {
    return buildResponse(400, 'Invalid AccountId, ContactId, or LeadId.')
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
    await dynamodb.send(new PutCommand(params))
    return buildResponse(200, 'Activity added successfully.')
  } catch (error) {
    return buildResponse(500, error.message)
  }
}
