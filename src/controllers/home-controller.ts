import { Request, Response} from 'express';
import fs from "fs";  
import asyncMw from "async-express-mw";
import handlebars from "handlebars";

export default new class HomeController {
  get = asyncMw(async (req: Request, res: Response) => {
    const templateSource = fs.readFileSync('src/views/home.hbs', 'utf8');
    const template = handlebars.compile(templateSource);
    const data: any = {
      authUrl: {
        google: `${process.env.API_URL}/auth/login/google`,
        facebook: `${process.env.API_URL}/auth/login/facebook`,
        twitter: `${process.env.API_URL}/auth/login/twitter`,
        linkedIn: `${process.env.API_URL}/auth/login/linkedin`,
        logout: `${process.env.API_URL}/auth/logout`,
      },
    };
    if(req.user) {
      data.user = {
        fullName: (req.user as any)?.fullName,
        imageUrl: (req.user as any)?.imageUrl,
      }
    }
    const html = template(data);
    res.status(200).send(html);
  });
}