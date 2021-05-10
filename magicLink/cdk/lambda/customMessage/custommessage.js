const WEB_URL = "http://localhost:8080/resetpassword";

exports.handler = (event, context, callback) => {

    var CustomMessage_ForgotPassword = `<style>
        p {
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        }
        </style>

        <div style="background: #fff1e2; padding:20px;">
        <p>Hello,</p>
        <p>Follow this link to reset your Password. </p>
        <p><a href="${WEB_URL}?code=${event.request.codeParameter}&username=${event.userName}"> Reset Password </a></p>
        <p>If you didn’t ask to change password, you can ignore this email.</p>
        <p>Thanks,</p>
        <p>Your website team</p>
        </div>`


    if (event.triggerSource === "CustomMessage_ForgotPassword") {
        event.response.emailMessage = CustomMessage_ForgotPassword;
    }

    callback(null, event);
};