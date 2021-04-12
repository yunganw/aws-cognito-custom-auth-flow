### Roles claim values in Cognito User Pool

1. Add Role claims to Native Userpool users
    
    Steps:

    + **Via AWS Console** -> Userpool - General Settings - Users and Groups -> right side **"Groups"** Tab - Create Group 
    
        Then in "Group" creation popup, it will let you select IAM Role or create a new role with the Group.

        API： [CreateGroup](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_CreateGroup.html)

    + Click **"Users"** Tab -> Select one user -> "Add to Group"

        zap: This will **NOT** grant the end user IAM role permissions, but only add the claim in his token. 

        API： [AdminAddUserToGroup](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminAddUserToGroup.html)

2. Add Role claims to Federated Users
    + For Userpool existing users 

        Use the same steps as Native Users by adding to Group

    + For non-existing users, needs to use lambda to programtically call adminAddUserToGroup.
        
        + IdP attributes used for assigning roles MUST in the attributes Mapping from IdP to userpool attributes.
        
        + post-confirm lambda is called when the user first time sign-in via Federation. 

        + post-authentication is called when the user 2nd and following sign-in via Federation. If the user's role needs to be adjusted from time to time whenever his attributes in IdP side changes, this lambda need to be used. 

        + Example lambda code 


            Lambda execution role permission

            + AWSLambdaBasicExecutionRole + [cognito-idp:AdminAddUserToGroup](https://gist.github.com/solariswu/d6eba3c027599f3af650389d5607bcf5)