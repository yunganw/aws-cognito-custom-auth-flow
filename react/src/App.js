import React, { useEffect, useState } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);



function App() {
  const [user, setUser] = useState(null);

  function signIn () {

    Auth.configure({
        authenticationFlowType: 'CUSTOM_AUTH'
    });
  
    let challengeResponse = "the answer for the challenge";
  
    Auth.signIn("solariswu")
        .then(user => {
            if (user.challengeName === 'CUSTOM_CHALLENGE') {
                // to send the answer of the custom challenge
                Auth.sendCustomChallengeAnswer(user, challengeResponse)
                    .then(user => console.log(user))
                    .catch(err => console.log(err));
            } else {
                console.log(user);
            }
        })
        .catch(err => console.log(err));
  }

  // useEffect(() => {
  //   Hub.listen('auth', ({ payload: { event, data } }) => {
  //     switch (event) {
  //       case 'signIn':
  //       case 'cognitoHostedUI':
  //         getUser().then(userData => setUser(userData));
  //         break;
  //       case 'signOut':
  //         setUser(null);
  //         break;
  //       case 'signIn_failure':
  //       case 'cognitoHostedUI_failure':
  //         console.log('Sign in failure', data);
  //         break;
  //     }
  //   });

  //   getUser().then(userData => setUser(userData));
  // }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  return (
    <div>
      <p>User: {user ? JSON.stringify(user.attributes) : 'None'}</p>
      {user ? (
        <button onClick={() => Auth.signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  );
}

export default App;