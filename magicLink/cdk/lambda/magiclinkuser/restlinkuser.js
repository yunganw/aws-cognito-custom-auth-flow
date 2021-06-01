//Initiate SDK
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider(process.env.AWS_REGION);
const USERPOOLID = 'us-east-1_FC8kBApuy';
const IDPNAMES = ['Google', 'Azure', 'Facebook'];


async function searchNativeUserByEmail (emailAddress, UserPoolId) {           
  const params = {
    UserPoolId, 
    Filter: "email = \""+emailAddress+"\"",
    Limit: '30'
  };
  
  let nativeUser = null;
      
  //If Federated/Social user for mapping already existing
  //    1. Delete the Federated/Social user to let the Native user created
  //    2. The Federated/Social user be linked later when next time 
  //       this Federated/Social user sign-in
  try {
    const listUserResult = await cognito.listUsers(params).promise();
    console.log ('listUserResult:', listUserResult);
    
    for (let i = 0; i < listUserResult.Users.length; i++)
      if (listUserResult.Users[i].UserStatus === "CONFIRMED") 
        // Only use the one of the native user with this email addr
        nativeUser = listUserResult.Users[i];

    return nativeUser;
  }
  catch (err) {
    console.log ('listUser error:', err);
    return null;
  }
}

async function deleteUser (Username, UserPoolId) {
  
  //Delete the Federated/Social User to let the native user creation
  //LinkUser on next time the External user sign-in in postSignUp lambda
  const params = {
    UserPoolId,
    Username,
  };
      
  try {
    const result = await cognito.adminDeleteUser(params).promise();
    console.log ('$username deleted!');
    return result;
  }
  catch (err) {
    console.log ('DeletUser Error: $err');
  }
}

async function linkUser (UserPoolId, destUsername, destUserIdp, 
    sourceUserId, sourceUserIdp) {
      
  console.log('adminLinkProviderForUserinkUser input:', UserPoolId, destUsername, destUserIdp,
    sourceUserId, sourceUserIdp);

  const params = {
      DestinationUser: {
        ProviderAttributeName: 'Username',  //ignored natually
        ProviderAttributeValue: destUsername,
        ProviderName: destUserIdp ////Cognito or IdP identiter name, eg.'AWS-SSO'
      },
      SourceUser: {
        ProviderAttributeName: 'Cognito_Subject',  //should be this for social IDP
        ProviderAttributeValue: sourceUserId, //mappping google sub to username/userid
        ProviderName: sourceUserIdp //Cognito or IdP identiter name, eg. 'myuserpool'
      },
      UserPoolId,
    };
    
    const result = await cognito.adminLinkProviderForUser(params).promise();

    console.log('linkUser result:', result);
    
    return result;
}

exports.handler = async (event, context) => {
    
    // console.log('Received event:', JSON.stringify(event, null, 2));
    // console.log('Received context:', JSON.stringify(context, null, 2));
    
    let statusCode = 200;
    let body =  JSON.stringify('Return from cogLinkUser!');

    const token = event.headers.Authorization;
    const tokenSections = (token || '').split('.');
    if (tokenSections.length < 2) {
        response.statusCode = 401;
        body = JSON.stringify('Token invalid');
    }
    else {
        const tokenPayloadJSON = Buffer.from(tokenSections[1], 'base64').toString('utf8');
        const tokenPayload = JSON.parse(tokenPayloadJSON);
        
        const userEmail = tokenPayload['email'];
        const username  = tokenPayload["cognito:username"];
        
        const matchesIdp = username.match(/(.+(?=_))/);
        
        // console.log ('username:', username, 'matchesIdp:',matchesIdp, 'match:', IDPNAMES.includes (matchesIdp[0]));
        
        if (username !== userEmail && matchesIdp && IDPNAMES.includes (matchesIdp[0])) {
            let nativeUser = await searchNativeUserByEmail(userEmail, USERPOOLID);
            if (nativeUser) {
              const matchesIdpUserId = username.match(/[^_]+$/);
              const DeletUserResult = await deleteUser(username, USERPOOLID);
              const result = await linkUser(USERPOOLID, nativeUser.Username, 'Cognito', matchesIdpUserId[0], matchesIdp[0]);
            }
        }

        body = JSON.stringify('Return from cogLinkUser!');
    }
    
    
    let response = {
        statusCode,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body,
    };
    
    return response;
};
