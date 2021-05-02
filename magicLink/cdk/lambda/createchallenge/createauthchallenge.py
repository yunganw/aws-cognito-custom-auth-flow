exports.handler = function(event, context) {
    console.log('entering createAuthChallenge');
    console.log('Received event:', JSON.stringify(event, null, 2));
    
   // console.log('test result', event.request.userAttributes.phone_number);
    
    if (event.request.challengeName == 'CUSTOM_CHALLENGE') {
        event.response.publicChallengeParameters = {};
        event.response.publicChallengeParameters.captchaUrl = 'url/123.jpg';
        event.response.publicChallengeParameters.USER_ID_FOR_SRP = event.userName;
        event.response.publicChallengeParameters.SRP_B = 100;
        event.response.publicChallengeParameters.SALT = 100;
        event.response.publicChallengeParameters.SECRET_BLOCK = "eaeafe";
        event.response.privateChallengeParameters = {};
        event.response.privateChallengeParameters.answer = 'googleToken';
        event.response.challengeMetadata = 'GOOGLETOKEN_CHALLENGE';
    }
    context.done(null, event);
}