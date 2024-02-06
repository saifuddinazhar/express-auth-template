import { PrismaClient } from "@prisma/client";
import passport from "passport"
import GoogleStrategy from "passport-google-oauth";
import FacebookStrategy from "passport-facebook";
import TwitterStrategy from "passport-twitter";
import LinkedInStrategy from "passport-linkedin-oauth2";
import userManager from "../business-logic/managers/user-manager";
import { UserAuthTypeEnum } from "../commons/enums/user-auth-type-enum";

export default new class PassportConfig {
  private googleStrategy() {
    return new GoogleStrategy.OAuth2Strategy({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.API_URL}/auth/redirect/google`,
    }, async (accessToken:string, refreshToken: string, profile: GoogleStrategy.Profile, callback: GoogleStrategy.VerifyFunction) => {
      try {
        const name = [];
        if(profile.name?.givenName) {
          name.push(profile.name?.givenName);
        }

        if(profile.name?.middleName) {
          name.push(profile.name.middleName);
        }

        if(profile.name?.familyName) {
          name.push(profile.name.familyName);
        }

        if(!profile.emails || profile.emails.length == 0) {
          throw new Error('No email found, please check app scope configuration');
        }

        const user = await userManager.login(profile.id, UserAuthTypeEnum.Google, {
          user: {
            fullName: name.join(' '),
            email: profile.emails[0].value,
            imageUrl: profile.photos?.length && profile.photos?.length > 0 ? profile.photos[0].value : null,
            auth: {
              profileId: profile.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              data: profile
            }
          }
        });
        callback(null, user);
      } catch(error) {
        callback(error, null);
      }
    });
  }

  private facebookStrategy() {
    return new FacebookStrategy.Strategy({
      clientID: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      callbackURL: `${process.env.API_URL}/auth/redirect/facebook`,
      profileFields: ['id', 'displayName', 'name', 'email', 'photos'],
      enableProof: true
    }, async (accessToken: string, refreshToken: string, profile: FacebookStrategy.Profile, callback) => {
      try {
        if(!profile.emails || profile.emails.length == 0) {
          throw new Error('No email found, please check app scope configuration');
        }

        const user = await userManager.login(profile.id, UserAuthTypeEnum.Facebook, {
          user: {
            fullName: profile.displayName,
            email: profile.emails[0].value,
            imageUrl: profile.photos?.length && profile.photos?.length > 0 ? profile.photos[0].value : null,
            auth: {
              profileId: profile.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              data: profile
            }
          }
        });
        callback(null, user);
      } catch(error: any) {
        callback(error, null);
      }
    });
  }

  private twitterStrategy() {
    return new TwitterStrategy.Strategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY as string,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET as string,
      callbackURL: `${process.env.API_URL}/auth/redirect/twitter`,
      includeEmail: true,
    }, async(token: string, tokenSecret: string, profile: TwitterStrategy.Profile, callback) => {
      try {
        if(!profile.emails || profile.emails.length == 0) {
          throw new Error('No email found, please check app scope configuration');
        }

        const user = await userManager.login(profile.id, UserAuthTypeEnum.Twitter, {
          user: {
            fullName: profile.displayName,
            email: profile.emails[0].value,
            imageUrl: profile.photos?.length && profile.photos?.length > 0 ? profile.photos[0].value : null,
            auth: {
              profileId: profile.id,
              accessToken: token,
              refreshToken: tokenSecret,
              data: profile
            }
          }
        });

        callback(null, user);
      } catch(error) {
        callback(error, null);
      }
    });
  }

  private linkedInStrategy() {
    return new LinkedInStrategy.Strategy({
      clientID: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      callbackURL:  `${process.env.API_URL}/auth/redirect/linkedin`,
      scope: ['openid', 'profile', 'email'],
    }, async (accessToken: string, refreshToken: string, profile: LinkedInStrategy.Profile, callback) => {
      try {
        const user = await userManager.login(profile.id, UserAuthTypeEnum.LinkedIn, {
          user: {
            fullName: profile.displayName,
            email: (profile as any).email,
            imageUrl: (profile as any).picture,
            auth: {
              profileId: profile.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              data: profile
            }
          }
        });
        callback(null, user);
      } catch(error) {
        callback(error, null);
      }
    });
  }

  initialize(passport: passport.Authenticator) {
    if(process.env.GOOGLE_ENABLE_AUTH === "true") {
      passport.use(this.googleStrategy());
    }

    if(process.env.FACEBOOK_ENABLE_AUTH === "true") {
      passport.use(this.facebookStrategy());
    }

    if(process.env.TWITTER_ENABLE_AUTH === "true") {
      passport.use(this.twitterStrategy());
    }

    if(process.env.LINKEDIN_ENABLE_AUTH === "true") {
      passport.use(this.linkedInStrategy());
    }
    passport.serializeUser((user: any, done) => done(null, user));
    passport.deserializeUser((user: any, done) => done(null, user));
  }
}
