from __future__ import print_function
import boto3
from botocore.exceptions import ClientError
from botocore.vendored import requests



AWS_REGION = 'us-east-1'
TOKEN_VALIDATOR_URL = 'https://api.yungangwu.myinstance.com/validatetoken'

def lambda_handler(event, context):

    print(event)
    
    event['response']['answerCorrect'] = False;
    
    challengeAnswer = event['request']['challengeAnswer']
    answerLength = len (challengeAnswer)
    
    if answerLength > 10:
        r = requests.get(TOKEN_VALIDATOR_URL, headers={"Authorization":challengeAnswer})
        print(r)
        if r.status_code == 200:
            event['response']['answerCorrect'] = True;
    
    if answerLength == 10:
        dynamodb = boto3.resource('dynamodb',region_name=AWS_REGION)
        table = dynamodb.Table('CdkStack-magiclinkTableE01A1656-51952RVXND2N')
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
