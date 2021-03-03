import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito'
import * as lambda from '@aws-cdk/aws-lambda'
import * as iam from '@aws-cdk/aws-iam'

const addLambdaTriggers = (context:cdk.Construct, userpool:cognito.UserPool) => {

  const createAuthChallengeFn = new lambda.Function(context, 'cdkCreateAuth', {
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset('lambda'),
    handler: 'createauthchallenge.handler',
  });
  
  const defineAuthChallengeFn = new lambda.Function(context, 'cdkDefineAuth', {
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset('lambda'),
    handler: 'defineauthchallenge.handler',
  });
  
  const verifyAuthChallengeFn = new lambda.Function(context, 'cdkVerifyAuth', {
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset('lambda'),
    handler: 'verifyauthchallenge.handler',
  });

  userpool.addTrigger(cognito.UserPoolOperation.CREATE_AUTH_CHALLENGE,
    createAuthChallengeFn);
  userpool.addTrigger(cognito.UserPoolOperation.DEFINE_AUTH_CHALLENGE,
    defineAuthChallengeFn);
  userpool.addTrigger(cognito.UserPoolOperation.VERIFY_AUTH_CHALLENGE_RESPONSE,
    verifyAuthChallengeFn);

  const basicLambdaPolicy = new iam.Policy(context, 'customauthfn-policy', {
    statements: [new iam.PolicyStatement({
      actions: ['logs:DescribeUserPool', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: ['*'],
    })],
  });

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
      userSrp: true
    },
    userPoolClientName: "webClient"
  });

}

export class UserpoolCustomauthflowStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    // The code that defines your stack goes here
    const userpool = new cognito.UserPool(this, 'myuserpool', {
      userPoolName: 'customauthflow',
      // use self sign-in is disable by default
      selfSignUpEnabled: true,
      // other option would be { email: true, phone: false }
      signInAliases: {
        // username sign-in
        username: true,
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

    addLambdaTriggers (this, userpool);

    addNoSecretAppClient (this, userpool);
  }
}

