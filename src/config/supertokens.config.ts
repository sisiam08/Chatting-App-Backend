import supertokens from "supertokens-node";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import Session from "supertokens-node/recipe/session";
import { envVar } from "./env";
import { UserRole } from "../generated/prisma/enums";
import { googleLogin } from "../modules/auth/auth.service";
import { IGoogleLogin } from "../interfaces";
import { UserServices } from "../modules/user/user.service";

export const initSuperTokens = () => {
  supertokens.init({
    framework: "express",
    supertokens: {
      connectionURI: "https://try.supertokens.com",
    },
    appInfo: {
      appName: "Chat-App",
      apiDomain: envVar.apiUrl,
      websiteDomain: envVar.appUrl,
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [
            {
              config: {
                thirdPartyId: "google",
                clients: [
                  {
                    clientId: envVar.google.googleClientId!,
                    clientSecret: envVar.google.googleClientSecret!,
                    scope: ["openid", "email", "profile"],
                  },
                ],
              },
            },
          ],
        },
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,
              signInUp: async function (input) {
                let response = await originalImplementation.signInUp(input);

                if (response.status === "OK") {
                  const userGoogleInfo =
                    response.rawUserInfoFromProvider.fromUserInfoAPI || {};

                  // console.log(
                  //   `New user google info:`,
                  //   JSON.stringify(userGoogleInfo, null, 2),
                  // );

                  const email = response.user.emails[0];

                  const emailFallbackName = email
                    ? email.split("@")[0]
                    : "Google User";

                  const userInfo = {
                    id: response.user.id,
                    name: userGoogleInfo.name || emailFallbackName,
                    email: email,
                    role: UserRole.USER,
                    emailVerified: userGoogleInfo.email_verified,
                    image:
                      userGoogleInfo.picture || userGoogleInfo.avatar_url || "",
                  };

                  // console.log(`New user registered:`, userInfo);

                  try {
                    const existingUser = await UserServices.getUserById(
                      userInfo.id,
                    );

                    if (existingUser) {
                      console.log(
                        `User with ID ${userInfo.id} already exists.`,
                      );
                    } else {
                      await googleLogin(userInfo as IGoogleLogin);
                    }
                  } catch (err) {
                    console.error(
                      `Error creating user in database for ${userInfo.email}:`,
                      err,
                    );
                  }
                }
                return response;
              },
            };
          },
        },
      }),

      Session.init({
        cookieSameSite: "none",
        cookieSecure: false,
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,
              createNewSession: async function (input) {
                const userId = input.userId;

                const userInfo = await supertokens.getUser(userId);
                const email = userInfo?.emails[0] || "";

                input.accessTokenPayload = {
                  ...input.accessTokenPayload,
                  email: email,
                  role: UserRole.USER,
                };

                return originalImplementation.createNewSession(input);
              },
            };
          },
        },
      }),
    ],
  });
};
