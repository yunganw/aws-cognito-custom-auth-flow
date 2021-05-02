import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito'
import * as lambda from '@aws-cdk/aws-lambda'
import * as iam from '@aws-cdk/aws-iam'


const addLambdaTriggersToUserPool = (context:cdk.Construct, userpool:cognito.UserPool) => {

  const createAuthChallengeFn = new lambda.Function(context, 'magicLinkSameBrowserCreateAuth', {
    runtime: lambda.Runtime.PYTHON_3_8,
    code: lambda.Code.fromAsset('lambda/createchallenge'),
    handler: 'createauthchallenge.lambda_handler',
  });
  
  const defineAuthChallengeFn = new lambda.Function(context, 'magicLinkSameBrowserDefineAuth', {
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset('lambda/definechallenge'),
    handler: 'defineauthchallenge.handler',
  });
  
  const verifyAuthChallengeFn = new lambda.Function(context, 'magicLinkSameBrowserVerifyAuth', {
    runtime: lambda.Runtime.PYTHON_3_8,
    code: lambda.Code.fromAsset('lambda/verifychallenge'),
    handler: 'verifyauthchallenge.lambda_handler',
  });

  const preSignUpFn = new lambda.Function(context, 'autoConfirmPreSignup', {
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset('lambda/presignup'),
    handler: 'presignuplambda.handler',
  });

  userpool.addTrigger(cognito.UserPoolOperation.CREATE_AUTH_CHALLENGE,
    createAuthChallengeFn);
  userpool.addTrigger(cognito.UserPoolOperation.DEFINE_AUTH_CHALLENGE,
    defineAuthChallengeFn);
  userpool.addTrigger(cognito.UserPoolOperation.VERIFY_AUTH_CHALLENGE_RESPONSE,
    verifyAuthChallengeFn);

  userpool.addTrigger(cognito.UserPoolOperation.PRE_SIGN_UP,
    preSignUpFn);

  const basicLambdaPolicy = new iam.Policy(context, 'magicsamebrowserlambdafn-policy', {
    statements: [new iam.PolicyStatement({
      actions: ['logs:DescribeUserPool', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: ['*'],
    })],
  });

  preSignUpFn.role?.attachInlinePolicy(basicLambdaPolicy);
  
  createAuthChallengeFn.role?.attachInlinePolicy(basicLambdaPolicy);
  defineAuthChallengeFn.role?.attachInlinePolicy(basicLambdaPolicy);
  verifyAuthChallengeFn.role?.attachInlinePolicy(basicLambdaPolicy);

}

const addNoSecretAppClient = (scope:cdk.Construct, userpool: cognito.UserPool) => {
  const userpoolclient = new cognito.UserPoolClient(scope, 'webClient', {
    userPool: userpool,
    generateSecret: false,
    authFlows: {
      custom: true,
      userSrp: true,
    },
    userPoolClientName: "webClient",
    oAuth: { // optional
      flows: {
        implicitCodeGrant: true,
        authorizationCodeGrant: true
      },
      callbackUrls: [
        'https://magiclink-samebrowser-yunganw.netlify.app/',
      ],
      logoutUrls: [
        'https://magiclink-samebrowser-yunganw.netlify.app/',
      ]
    }

  });

}

export class Cdk2Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    // The code that defines your stack goes here
    const userpool = new cognito.UserPool(this, 'userpool', {
      userPoolName: 'magicLinkSameBrowser',
      // use self sign-in is disable by default
      selfSignUpEnabled: true,
      // other option would be { email: true, phone: false }
      signInAliases: {
        // username sign-in
        username: false,
        // email could be alias
        email: true
      },
      // user attributes
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        }
      },
      // no customer attribute
      // MFA optional
      mfa: cognito.Mfa.OPTIONAL,
      // forgotPassword recovery method, phone by default
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,

    });

    addLambdaTriggersToUserPool (this, userpool);
    addNoSecretAppClient (this, userpool);

    // Hosted UI config Optional
    userpool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix: 'magiclink-samebrowser',
      },
    });

  }
}

