import json

import string
import random

import boto3
from botocore.exceptions import ClientError


AWS_REGION = "us-east-1"
SUBJECT = "Magic link from Hogwarts"
CHARSET = "UTF-8"
SENDER = "Hogwarts <solariswu@test.com>"


def lambda_handler(event, context):
    
    RESCODE = 200
    RESBODY = json.dumps("Email Sent!")

    # printing letters
    letters = string.ascii_letters
    magicstring = ( ''.join(random.choice(letters) for i in range(10)) )
    print (magicstring)
    
    dynamodb = boto3.resource('dynamodb',region_name=AWS_REGION)

    table = dynamodb.Table('magiclink')
    
    try:
        response = table.put_item(
           Item={
                'id': event['username'],
                'session': event['session'],
                'magicstring': magicstring
            }
        )
    except ClientError as e:
            print(e.response['Error']['Message'])
            RESBODY = json.dumps(e.response['Error']['Message'])
            RESCODE=400
            
            return {
                'statusCode': RESCODE,
                'body': RESBODY
            } 
    else:
        print("MagicCode saved ID:"),
        print(response)
    
    RECIPIENT = event['email']

    
    # The email body for recipients with non-HTML email clients.
    BODY_TEXT = ("Hello, here is your magic ticket for entering Hogwarts.\r\n"
             "https://magiclink-yunganw.netlify.app/hogwarts?"
            )
    queryParam = "username=" + event['username'] + "&answer=" + magicstring

    BODY_TEXT = BODY_TEXT + queryParam
            
    # The HTML body of the email.
    BODY_HTML = """<html>
    <head></head>
    <body>
    <h1>Magic ticket to enter Hogwarts</h1>
    <p><a href='https://magiclink-yunganw.netlify.app/hogwarts?"""
    
    BODY_HTML = BODY_HTML + queryParam
    
    BODY_HTML = BODY_HTML + """'>Click Here</a>.</p>
    </body>
    </html>
    """  
    # Create a new SES resource and specify a region.
    client = boto3.client('ses',region_name=AWS_REGION)
    
    # Try to send the email.
    try:
        #Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': BODY_TEXT,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER,
        )
    # Display an error if something goes wrong.	
    except ClientError as e:
        print(e.response['Error']['Message'])
        RESBODY = json.dumps(e.response['Error']['Message'])
        RESCODE=400
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])

    return {
        'statusCode': RESCODE,
        'body': RESBODY
    }




