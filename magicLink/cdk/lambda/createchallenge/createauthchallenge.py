import string
import random

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

AWS_REGION = "us-east-1"
SUBJECT = "Magic link from Hogwarts"
CHARSET = "UTF-8"
SENDER = "Hogwarts <solariswu@hotmail.com>"

LANDING_URL = "https://magiclink-samebrowser-yunganw.netlify.app/hogwarts?"

def sendEmail (text, html, toAddress):

    msg = MIMEMultipart('alternative')
    msg['Subject'] = SUBJECT
    msg['From'] = SENDER
    msg['To'] = toAddress

    # Record the MIME types of both parts - text/plain and text/html.
    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')
    
    msg.attach(part1)
    msg.attach(part2)
    
    
    # Send the message via our own SMTP server.
    gmailaddress = "niunaihemianbao012@gmail.com"
    gmailpassword = "YunMin0826"
    mailServer = smtplib.SMTP('smtp.gmail.com' , 587)
    mailServer.starttls()
    mailServer.login(gmailaddress , gmailpassword)
    
    mailServer.sendmail(SENDER, toAddress, msg.as_string())

    print(" \n Sent!")
    mailServer.quit()

def compose_text_email (queryParam):
    # The email body for recipients with non-HTML email clients.
    text_content = ("Hello, here is your magic ticket for entering Hogwarts.\r\n")
    text_content = text_content + LANDING_URL + queryParam
    
    return text_content

def compose_html_email (queryParam):
    # The HTML body of the email.
    html_content = """<html>
    <head></head>
    <body>
    <h1>Magic ticket to enter Hogwarts</h1>
    <p><a href='"""
    
    html_content = html_content + LANDING_URL + queryParam
    
    html_content = html_content + """'>Click Here</a>.</p>
    </body>
    </html>
    """  

    return html_content
    
def lambda_handler(event, context):

    print(event)

    # printing letters
    letters = string.ascii_letters
    magicstring = ( ''.join(random.choice(letters) for i in range(10)) )
    print (magicstring)
    
    RECIPIENT = event['request']['userAttributes']['email']

    queryParam = "username=" + RECIPIENT + "&answer=" + magicstring

    BODY_TEXT = compose_text_email (queryParam)
    
    BODY_HTML = compose_html_email (queryParam)

    sendEmail (BODY_TEXT, BODY_HTML, RECIPIENT)
    
    # This is sent back to the client app
    event['response']['publicChallengeParameters'] = {};
    
    event['response']['publicChallengeParameters']['username'] = RECIPIENT;


    # Add the secret login code to the private challenge parameters
    # so it can be verified by the "Verify Auth Challenge Response" trigger
    event['response']['privateChallengeParameters'] = {};
    event['response']['privateChallengeParameters']['magicCode'] = magicstring;

    # Add the secret login code to the session so it is available
    # in a next invocation of the "Create Auth Challenge" trigger
    event['response']['challengeMetadata'] = 'CODE-' + magicstring;
        
    print(event)

    return event