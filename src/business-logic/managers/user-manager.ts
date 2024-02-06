import { PrismaClient, User } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { UserAuthTypeEnum } from "../../commons/enums/user-auth-type-enum";
import path from "path";
import fs from "fs";

export default new class UserManager {
  public async login(profileId: string, authType: UserAuthTypeEnum, options: {
    user: {
      fullName?: string | null | undefined,
      email: string,
      imageUrl?: string | null | undefined,
      auth: {
        profileId: string,
        accessToken?: string | undefined, 
        refreshToken?: string| undefined,
        data?: object | undefined,
      }
    }
  }) {
    const prisma = new PrismaClient();

    let user = await prisma.user.findFirst({
      where: { email: options.user.email }
    });

    if(!user) {
      let imageFileName = null;
        
      if(options.user.imageUrl) {
        try {
          const response = await axios.get(options.user.imageUrl, { responseType: 'stream' });
          if(response.status !== 200) {
            throw new Error('Unknown error ' + response.status + ' ' + response.statusText);
          }
          
          await new Promise((resolve, reject) => {
            imageFileName = new Date().getTime() + '.jpg';
            const savePath = path.join(__dirname, "../../../" ,process.env.PROFILE_PICTURE_SAVE_PATH as string, imageFileName);

            const fileStream = fs.createWriteStream(savePath);
            response.data.pipe(fileStream);

            fileStream.on('finish', () => {
              fileStream.close();
              resolve(null);
            });

            fileStream.on('error', (error) => {
              reject(error)
            });
          });           
        } catch(error: Error | any) {
          let errorMessage = 'Error when download image ' + options.user.imageUrl + ' for user ' + options.user.fullName + ' with profileId ' + profileId + ' and authType ' + authType;
          if(error instanceof AxiosError) {
            errorMessage += ', code ' + error.code
          }
          console.error(errorMessage);
          console.error(error);
        }
      }

      user = await prisma.user.create({
        data: {
          fullName: options.user.fullName,
          email: options.user.email,
          imageName: imageFileName,
        }
      });
    }

    if(user) {
      const userAuth = await prisma.userAuth.findFirst({
        where: {
          email: options.user.email,
          authType: authType,
        }
      });

      if(userAuth) {
        await prisma.userAuth.update({
          data: {
            accessToken: options.user.auth.accessToken,
            secretToken: options.user.auth.refreshToken,
            data: options.user.auth.data,
          },
          where: {
            id: userAuth.id,
          }
        })
      } else {
        await prisma.userAuth.create({
          data: {
            email: user.email,
            profileId: profileId,
            authType: authType,
            accessToken: options.user.auth.accessToken,
            secretToken: options.user.auth.refreshToken,
            data: options.user.auth.data,
          }
        });
      }
    }

    prisma.$disconnect();

    return {
      id: user.id,
      fullName: user.fullName,
      imageUrl: `${process.env.API_URL}/${process.env.PROFILE_PICTURE_SAVE_PATH}/${user.imageName}`,
    };
  }
}