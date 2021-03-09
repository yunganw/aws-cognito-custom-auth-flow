package com.example.cognitone;

import androidx.appcompat.app.AppCompatActivity;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.amazonaws.mobile.client.AWSMobileClient;
import com.amazonaws.mobile.client.Callback;
import com.amazonaws.mobile.client.results.SignInResult;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.util.CognitoServiceConstants;
import com.amplifyframework.auth.cognito.AWSCognitoAuthSession;
import com.amplifyframework.auth.cognito.AWSCognitoUserPoolTokens;
import com.amplifyframework.auth.options.AuthSignOutOptions;
import com.amplifyframework.auth.result.AuthSessionResult;
import com.amplifyframework.auth.result.step.AuthSignInStep;
import com.amplifyframework.core.Amplify;
import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.auth0.android.jwt.Claim;
import com.auth0.android.jwt.JWT;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "MainActivity";
    private static final String METADATA_IP_KEY = "IP Address";
    private static final String GGLSIGNIN_CLIENT_ID =
            "286703328508-k0e6j169mo5n9u7a3d0i6mmd09e1bhrg.apps.googleusercontent.com";
    private static final int RC_SIGN_IN = 9001;

    @BindView(R.id.tv_userinfo)
    TextView mUserInfo;

    @BindView(R.id.sign_in_button)
    SignInButton mSignInButton;

    Unbinder unbinder;
    private GoogleSignInClient mGoogleSignInClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        unbinder = ButterKnife.bind(this);

        Amplify.Auth.fetchAuthSession(
                fetchAuthRst -> {
                    Log.d(TAG, fetchAuthRst.toString());
                    if (fetchAuthRst.isSignedIn()) {

                        runOnUiThread(new Runnable() {
                            public void run() {
                                Toast.makeText(getApplicationContext(),
                                        "Cognito user already signed in. \nSigning out now...",
                                        Toast.LENGTH_SHORT).show();
                            }
                        });

//                        Toast.makeText(this,
//                                "Cognito user already signed in. Signing out now...",
//                                Toast.LENGTH_SHORT);
                        Amplify.Auth.signOut(
                                AuthSignOutOptions.builder().globalSignOut(true).build(),
                                () -> {
//                                    Toast.makeText(this,
//                                            "Cognito user signed out!",
//                                            Toast.LENGTH_SHORT);
                                    Log.i(TAG, "Cognito User signed out globally");
                                },
                                signOutError -> Log.e(TAG, signOutError.toString()));
                    }
                },//mUserInfo.setText(result.toString()),
                fetchAuthError -> Log.e (TAG, fetchAuthError.toString())
        );

        // Configure sign-in to request the user's ID, email address, idToken and basic
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(GGLSIGNIN_CLIENT_ID)
                .requestProfile()
                .requestEmail()
                .build();

        // Build a GoogleSignInClient with the options specified by gso.
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unbinder.unbind();
    }

    protected void updateUI (GoogleSignInAccount account) {
        if (account != null) {
            Log.d(TAG, "google account: " + account.getDisplayName());
            mUserInfo.setText(account.getIdToken());

        }
    }

    @Override
    protected  void onStart () {
        super.onStart();

        // Check for existing Google Sign In account, if the user is already signed in
        // the GoogleSignInAccount will be non-null.
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);
        updateUI(account);
    }

    private void googleSignIn() {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    private void startCognitoLogin (String googleToken) {

        Log.i (TAG, "Sending prelogin request");
        RequestQueue queue = Volley.newRequestQueue(this);
        String url ="https://9ni35pd8fe.execute-api.us-east-1.amazonaws.com/v1/prelogin";

        JWT jwt = new JWT(googleToken);

        String userEmail = jwt.getClaim("email").asString();
        Map<String, Claim> Claims = jwt.getClaims();
        Log.i(TAG, "google claims:" + Claims);

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                (Request.Method.POST, url, null, response -> {
                    //Log.i (TAG, "volley response:" + response.toString());
                    String body = null;
                    Integer statusCode = 0;
                    try {
                        body = response.getString("body");
                        statusCode = response.getInt("statusCode");

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    Log.i (TAG, "volley response code:" + statusCode + " body:" + body);

                    cognitoSignIn(googleToken);
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e(TAG, "Volley request error!" + error.toString());
            }
        }){
            @Override
            public byte[] getBody() {
                String postJsonStr = "{\"username\": \"" + userEmail +
                        "\", \"email\": \"" + userEmail + "\"}";
                return postJsonStr.getBytes();
            }
        };

        queue.add(jsonObjectRequest);
    }

    private void cognitoSignIn (String googleToken) {
        Log.d (TAG, "google idtoken: " + googleToken);

        Amplify.Auth.signIn(
                "Google_111444088505388539089", //"hulutest", //
                "dummy", //this can be any dummy password
                result -> {
                    if (result.getNextStep().getSignInStep()
                            .equals(AuthSignInStep.CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE)) {

//                  Auth.confirmSignIn for Custom Auth Flow has not implemented in Ampliy android
//                      Amplify.Auth.confirmSignIn(res,//idToken,
//                              confirmResult -> Log.i(TAG, "custom auth done!"),
//                              confirmError -> Log.w(TAG, "custom auth error" + confirmError));


                        Map<String, String> res = new HashMap<String, String>();
                        res.put(CognitoServiceConstants.CHLG_RESP_ANSWER, googleToken);

                        Map<String, String> metaData = new HashMap<String, String>();
                        res.put(CognitoServiceConstants.CHLG_RESP_ANSWER, googleToken);

                        metaData.put(METADATA_IP_KEY, "192.168.0.1");

                        AWSMobileClient mobileClient = (AWSMobileClient) Amplify.Auth
                                .getPlugin("awsCognitoAuthPlugin").getEscapeHatch();

                        mobileClient.confirmSignIn(res, metaData, new Callback<SignInResult>() {
                            @Override
                            public void onResult(final SignInResult signInResult) {
                                Log.i (TAG, "custom sign-in done! User State: " +
                                        signInResult.getSignInState());
                                //Handle the result

                                Amplify.Auth.fetchAuthSession(
                                        fetchAuthRst -> {
                                            AWSCognitoAuthSession cognitoAuthSession =
                                                    (AWSCognitoAuthSession) fetchAuthRst;

                                            JWT jwtIdToken = new JWT(cognitoAuthSession.getUserPoolTokens()
                                                    .getValue().getIdToken());

                                            Log.d (TAG, "cognito IdToken: " + jwtIdToken);
                                            Log.i(TAG, "cognito User "+
                                                    jwtIdToken.getClaim("cognito:username").asString() +
                                                    " signed in!"
                                            );
                                        },
                                        fetchAuthError -> Log.e (TAG, fetchAuthError.toString())
                                );
                            }

                            @Override
                            public void onError(Exception e) {
                                Log.e(TAG, "sign-in error", e);
                            }
                        });
                    }
                    else
                        Log.w (TAG, "auth next step not handled " + result.getNextStep());
                },
                error -> Log.i (TAG, "login failed:" + error));
    }

    @OnClick (R.id.sign_in_button)
    public void signInButtonClick (View view) {
        googleSignIn();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            // The Task returned from this call is always completed, no need to attach
            // a listener.
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task);
        }
    }

    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);

            // Signed in successfully, show authenticated UI.
            updateUI(account);

            String googleToken = account.getIdToken();

            startCognitoLogin(googleToken);
        } catch (ApiException e) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w(TAG, "Google SignInResult:failed code=" + e.getStatusCode());
            updateUI(null);
        }
    }
}