from __future__ import print_function
import boto3
from botocore.exceptions import ClientError

AWS_REGION = 'us-east-1'

def lambda_handler(event, context):

    print(event)
    
    expectedAnswer = event['request']['privateChallengeParameters']['magicCode']; 
    if event['request']['challengeAnswer'] == expectedAnswer :
        event['response']['answerCorrect'] = True;
    else:
        event['response']['answerCorrect'] = False;
        
    print(event)

    return event