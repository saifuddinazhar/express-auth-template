## How to setup
1. Run `npm install`
2. Run `npm run migrate`
3. Copy .env.example to .env
4. Set the .env variables (url, connection string, etc)
5. Run `npm run dev`


### How to setup and get GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
1. Go to Google Cloud Console https://console.cloud.google.com/apis/dashboard
2. Create new project, don't forget to setup "Scopes"
3. Go to "Credentials" > OAuth 2.0 Client IDs > Create new client
   * Set the "Authorised redirect URIs" to http://localhost:3000/auth/redirect/google
   * Get the Client ID and Client Secret
4. Put the Client ID and Client Secret to .env

### How to setup and get FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET
1. Go to Facebook Developer https://developers.facebook.com/
2. Go to "My App", create new App, complete any setup and verification
3. Enable Facebook Login by adding "Facebook Login" to product. From the dashboard, click "add product" in the left sidebar. 
4. Go to Application Settings > Basic > Get the Application ID and Application secret
5. Put the ID and secret to .env


### How to setup and get TWITTER_CONSUMER_KEY and TWITTER_CUSTOMER_SECRET
1. Go to twitter developer portal https://developer.twitter.com/en/portal/dashboard
2. When we create new developer account, it usually create a default project and app. Based on my experience, we can't use that default app. We can delete all of default app and default project. 
3. Create new project
4. Create new app
5. From the app, click "key" icon to get consumer key and secret
6. Put the key and secret to .env

### How to setup and get LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET
1. Go to Linked In developer https://www.linkedin.com/developers
2. Create new app and set the properties
3. In the product add "Sign In with LinkedIn using OpenID Connect"
4. Put the client id and secret to .env
5. Warning: when this project was created, there had just been API changes in linked in. The passport-linkedin-oauth2 package in NPM does not fully support the new API. We use the unreleased version of on passport-linkedin-oauth2 from github. Please check the package.json for more detail. 