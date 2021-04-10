import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito'
import * as lambda from '@aws-cdk/aws-lambda'
import * as iam from '@aws-cdk/aws-iam'
import * as dynamodb from '@aws-cdk/aws-dynamodb';


const addLambdaTriggersToUserPool = (context:cdk.Construct, userpool:cognito.UserPool) => {

  const createAuthChallengeFn = new lambda.Function(context, 'cdkMagicCreateAuth', {
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset('lambda'),
    handler: 'createauthchallenge.handler',
  });
  
  const defineAuthChallengeFn = new lambda.Function(context, 'cdkMagicDefineAuth', {
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset('lambda'),
    handler: 'defineauthchallenge.handler',
  });
  
  const verifyAuthChallengeFn = new lambda.Function(context, 'cdkMagicVerifyAuth', {
    runtime: lambda.Runtime.PYTHON_3_8,
    code: lambda.Code.fromAsset('lambda'),
    handler: 'verifyauthchallenge.lambda_handler',
  });

  const preSignUpFn = new lambda.Function(context, 'cdkMagicPreSignup', {
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset('lambda'),
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

  const basicLambdaPolicy = new iam.Policy(context, 'customauthmagicfn-policy', {
    statements: [new iam.PolicyStatement({
      actions: ['dynamodb:GetItem','logs:DescribeUserPool', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: ['*'],
    })],
  });

  createAuthChallengeFn.role?.attachInlinePolicy(basicLambdaPolicy);
  defineAuthChallengeFn.role?.attachInlinePolicy(basicLambdaPolicy);
  verifyAuthChallengeFn.role?.attachInlinePolicy(basicLambdaPolicy);
  preSignUpFn.role?.attachInlinePolicy(basicLambdaPolicy);

}

const addNoSecretAppClient = (scope:cdk.Construct, userpool: cognito.UserPool) => {
  const userpoolclient = new cognito.UserPoolClient(scope, 'webClient', {
    userPool: userpool,
    generateSecret: false,
    authFlows: {
      custom: true,
      userSrp: true,
    },
    userPoolClientName: "webClient"
  });

}

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    // The code that defines your stack goes here
    const userpool = new cognito.UserPool(this, 'myuserpool', {
      userPoolName: 'magicLink',
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

    const magiclinkTable = new dynamodb.Table(this, 'magiclinkTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    });


  }
}

