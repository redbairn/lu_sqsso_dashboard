# lu_sqsso_dashboard

## About the project
This SQSSO app allows anybody to test out the SQSSO integration between this app and their LearnUpon portal.

 **Note: This can only be tested with a portal that has no mandatory custom user data enabed! You would need to temporarily set all custom user data to be optional.**

## About SQSSO
Signed Query Single Sign-On (SQSSO) is a lightweight single sign-on mechanism that you can use to "silently" log your users in to LearnUpon.

Lightweight is not less secure. In this context, it means it is easier to implement than some SSO modules such as OAuth or SAML.

The basic premise behind SQSSO is that both LearnUpon and a third party share a secret key. Using this secret key, the calling party (the customer's system) "signs" a URL request: a request to log a user in to LearnUpon. Once LearnUpon validates this request, the user is logged into their portal on LearnUpon "silently" - without the need to re-authenticate.

If you require SQSSO access on your portal, contact the Support team.

Read more about SQSSO settings [here](https://support.learnupon.com/hc/en-us/articles/360003373518-Set-up-SQSSO-for-your-portal#SQSSOGeneralSettings).
