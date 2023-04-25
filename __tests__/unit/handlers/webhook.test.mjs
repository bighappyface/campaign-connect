import { webhookHandler } from '../../../src/handlers/webhook.mjs'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'

describe('Webhook function', () => {
  const ddbMock = mockClient(DynamoDBDocumentClient)

  beforeEach(() => {
    ddbMock.reset()
  })

  test('returns a 200 status code for a valid request with all fields', async () => {
    const event = {
      queryStringParameters: {
        CampaignName: 'Test Campaign',
        UserToken: 'abc123',
        AccountId: '0011t00000abcxyz',
        ContactId: '0031t00000abcxyz',
        LeadId: '00Q1t00000abcxyz',
      },
    }
    const context = {}
    ddbMock.on(PutCommand).resolves({})
    const response = await webhookHandler(event, context)

    expect(response.statusCode).toBe(200)
    expect(ddbMock).toHaveReceivedCommand(PutCommand)
  })

  test('returns a 200 status code for a valid CampaignName and UserToken', async () => {
    const event = {
      queryStringParameters: {
        CampaignName: 'Test Campaign',
        UserToken: 'abc123',
      },
    }
    const context = {}
    ddbMock.on(PutCommand).resolves({})
    const response = await webhookHandler(event, context)

    expect(response.statusCode).toBe(200)
    expect(ddbMock).toHaveReceivedCommand(PutCommand)
  })

  test('returns a 200 status code for a valid CampaignName and AccountId', async () => {
    const event = {
      queryStringParameters: {
        CampaignName: 'Test Campaign',
        AccountId: '0011t00000abcxyz',
      },
    }
    const context = {}
    ddbMock.on(PutCommand).resolves({})
    const response = await webhookHandler(event, context)

    expect(response.statusCode).toBe(200)
    expect(ddbMock).toHaveReceivedCommand(PutCommand)
  })

  test('returns a 200 status code for a valid CampaignName and ContactId', async () => {
    const event = {
      queryStringParameters: {
        CampaignName: 'Test Campaign',
        ContactId: '0011t00000abcxyz',
      },
    }
    const context = {}
    ddbMock.on(PutCommand).resolves({})
    const response = await webhookHandler(event, context)

    expect(response.statusCode).toBe(200)
    expect(ddbMock).toHaveReceivedCommand(PutCommand)
  })

  test('returns a 200 status code for a valid CampaignName and LeadId', async () => {
    const event = {
      queryStringParameters: {
        CampaignName: 'Test Campaign',
        LeadId: '0011t00000abcxyz',
      },
    }
    const context = {}
    ddbMock.on(PutCommand).resolves({})
    const response = await webhookHandler(event, context)

    expect(response.statusCode).toBe(200)
    expect(ddbMock).toHaveReceivedCommand(PutCommand)
  })

  test('returns a 400 status code for a request missing the CampaignName parameter', async () => {
    const event = {
      queryStringParameters: {
        UserToken: 'abc123',
        AccountId: '0011t00000abcxyz',
        ContactId: '0031t00000abcxyz',
        LeadId: '00Q1t00000abcxyz',
      },
    }
    const context = {}
    const response = await webhookHandler(event, context)

    expect(response.statusCode).toBe(400)
  })

  test('returns a 400 status code for a request with an invalid AccountId parameter', async () => {
    const event = {
      queryStringParameters: {
        CampaignName: 'Test Campaign',
        UserToken: 'abc123',
        AccountId: 'invalid_id',
        ContactId: '0031t00000abcxyz',
        LeadId: '00Q1t00000abcxyz',
      },
    }
    const context = {}
    const response = await webhookHandler(event, context)

    expect(response.statusCode).toBe(400)
  })

  test('returns a 400 status code for a request with an invalid ContactId parameter', async () => {
    const event = {
      queryStringParameters: {
        CampaignName: 'Test Campaign',
        UserToken: 'abc123',
        AccountId: '0011t00000abcxyz',
        ContactId: 'invalid_id',
        LeadId: '00Q1t00000abcxyz',
      },
    }
    const context = {}
    const response = await webhookHandler(event, context)

    expect(response.statusCode).toBe(400)
  })

  test('returns a 400 status code for a request with an invalid LeadId parameter', async () => {
    const event = {
      queryStringParameters: {
        CampaignName: 'Test Campaign',
        UserToken: 'abc123',
        AccountId: '0011t00000abcxyz',
        ContactId: '0031t00000abcxyz',
        LeadId: 'invalid_id',
      },
    }
    const context = {}
    const response = await webhookHandler(event, context)

    expect(response.statusCode).toBe(400)
  })
})
