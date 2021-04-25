// const auth_url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=';

// const axios = require('axios')
exports.handler = async (event, context) => {
    console.log('entering verifyAuthChallenge');
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));

    // if (event.request.privateChallengeParameters.answer == event.request.challengeAnswer) {
    //     event.response.answerCorrect = true;
    // } else {
    //     event.response.answerCorrect = false;
    // }
    
    event.response.answerCorrect = false;

    if (event.request.privateChallengeParameters.answer == "googleToken") {
        try {
//            const res = await axios.get(auth_url+event.request.challengeAnswer);
            console.log("google token : test");//,res.data);
            event.response.answerCorrect = true;
        } catch (e) {
            console.log("error--" ,e);
        } 
    } else {
        console.log ("Unknow challenge");
    }
    
    context.done(null, event);
}