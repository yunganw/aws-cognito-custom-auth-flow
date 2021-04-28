exports.handler = function(event, context) {
    console.log('entering defineAuthChallenge');
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));


    console.log('event.request.session.length:', event.request.session.length);
    
    // https://docs.amplify.aws/sdk/auth/custom-auth-flow/q/platform/android#lambda-trigger-setup
    // if (event.request.session.length === 1 && 
    //     event.request.session[0].challengeName === 'SRP_A') {
    //     event.response.issueTokens = false;
    //     event.response.failAuthentication = false;
    //     event.response.challengeName = 'CUSTOM_CHALLENGE';
    // } else if (
    //   event.request.session.length === 2 &&
    //   event.request.session[1].challengeName === 'CUSTOM_CHALLENGE' &&
    //   event.request.session[1].challengeResult === true
    // ) {
    //   event.response.issueTokens = true;
    //   event.response.failAuthentication = false;
    // } else {
    //   event.response.issueTokens = false;
    //   event.response.failAuthentication = true;
    // }

    // React default CUSTOM_AUTH
    if (event.request.session.length == 1 && event.request.session[0].challengeName == 'SRP_A') {
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = 'PASSWORD_VERIFIER';
    } else if (event.request.session.length == 2 && event.request.session[1].challengeName == 'PASSWORD_VERIFIER') {// && event.request.session[1].challengeResult == true) {
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = 'CUSTOM_CHALLENGE';
    } else if (event.request.session.length == 3 && event.request.session[2].challengeName == 'CUSTOM_CHALLENGE' && event.request.session[2].challengeResult == true) {
        event.response.issueTokens = true;
        event.response.failAuthentication = false;
    } else {
        event.response.issueTokens = false;
        event.response.failAuthentication = true;
    }

    // // test with Byran Chou's
    // if (event.request.session.length === 0) {
    //     event.response.issueTokens = false;
    //     event.response.failAuthentication = false;
    //     event.response.challengeName = 'CUSTOM_CHALLENGE';
    //   } else if (
    //     event.request.session.length === 1 &&
    //     event.request.session[0].challengeName === 'CUSTOM_CHALLENGE' &&
    //     event.request.session[0].challengeResult === true
    //   ) {
    //     event.response.issueTokens = true;
    //     event.response.failAuthentication = false;
    //   } else {
    //     event.response.issueTokens = false;
    //     event.response.failAuthentication = true;
    //   }
    
    context.done(null, event);
}
