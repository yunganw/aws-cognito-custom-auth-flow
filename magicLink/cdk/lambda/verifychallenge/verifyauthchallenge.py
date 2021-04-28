from __future__ import print_function
import boto3
from botocore.exceptions import ClientError

AWS_REGION = 'us-east-1'

def lambda_handler(event, context):

    print(event)
    
    dynamodb = boto3.resource('dynamodb',region_name=AWS_REGION)
    table = dynamodb.Table('magiclink')
    item = ''

    useremail = event['request']['userAttributes']['email'];

    try:
        response = table.get_item(Key={'id': useremail})
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print(response)
        item = response['Item']
    
    if item['magicstring'] == event['request']['challengeAnswer']:
        event['response']['answerCorrect'] = True;
        
    print(event)

    return event
