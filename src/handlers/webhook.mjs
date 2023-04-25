import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const clientConfig = {}

const docClientConfig = {
  marshallOptions: {
    removeUndefinedValues: true,
  }
}

if (process.env.AWS_SAM_LOCAL == "true") {
  clientConfig.region = process.env.AWS_REGION
  clientConfig.endpoint = 'http://dynamodb-local:8000',
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
}

const client = new DynamoDBClient(clientConfig)
const dynamodb = DynamoDBDocumentClient.from(client, docClientConfig)

const tableName = process.env.TABLE_NAME

const buildResponse = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ message: message }),
  }
}

export const webhookHandler = async (event) => {

  const { queryStringParameters: queryParams } = event
  const { CampaignName, AccountId, ContactId, LeadId, UserToken } = queryParams

  if (!CampaignName || (!AccountId && !ContactId && !LeadId && !UserToken)) {
    return buildResponse(
      400,
      'CampaignName and at least one of the IDs or UserToken are required query parameters.',
    )
  }

  if (
    (AccountId && !/^[a-zA-Z0-9]{15,18}$/.test(AccountId)) ||
    (ContactId && !/^[a-zA-Z0-9]{15,18}$/.test(ContactId)) ||
    (LeadId && !/^[a-zA-Z0-9]{15,18}$/.test(LeadId))
  ) {
    return buildResponse(400, 'Invalid AccountId, ContactId, or LeadId.')
  }

  const params = {
    TableName: tableName,
    Item: {
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

