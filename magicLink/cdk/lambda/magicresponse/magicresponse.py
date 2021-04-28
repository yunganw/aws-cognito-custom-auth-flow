import json

import boto3
from botocore.exceptions import ClientError

AWS_REGION = "us-east-1"
USERPOOLID = "us-east-1_xxxx"
CLIENTID = "xxxx"

def lambda_handler(event, context):
    
    RESCODE = 200
    RESBODY = json.dumps("All Good!")
    
    if event['prewarm'] == 'yes':
        return {
            'statusCode': RESCODE,
            'body': RESBODY
        }
    
    item = ''

    dynamodb = boto3.resource('dynamodb',region_name=AWS_REGION)

    table = dynamodb.Table('magiclink')
    
    try:
        response = table.get_item(Key={'id': event['username']})
    except ClientError as e:
        print(e.response['Error']['Message'])
        RESBODY = json.dumps(e.response['Error']['Message'])
        RESCODE = 400
    else:
        print(response)
        item = response['Item']
        
    cognito = boto3.client('cognito-idp')
    
    print(item['session'])

    try:
        response = cognito.admin_respond_to_auth_challenge(
            UserPoolId=USERPOOLID,
            ClientId=CLIENTID,
            
            ChallengeName='CUSTOM_CHALLENGE',
            ChallengeResponses={
                'USERNAME': event['username'],
                'ANSWER': event['magicstring']
            },
            Session=item['session']
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
        RESBODY = json.dumps(e.response['Error']['Message'])
        RESCODE = 400
    else:
        ## print(response)
        RESBODY = json.dumps(response['AuthenticationResult'])

    print (RESBODY)
    return {
        'statusCode': RESCODE,
        'body': RESBODY
    }




