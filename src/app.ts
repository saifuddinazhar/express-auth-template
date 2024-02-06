import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import route from './routes';
import passportConfig from './configs/passport-config';
import path from 'path';

dotenv.config();
passportConfig.initialize(passport);

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);


app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

console.log(path.join(__dirname, "../public"));
app.use('/public', express.static(path.join(__dirname, "../", process.env.PUBLIC_DIRECTORY as string)));
app.use(route)
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send(`Something went wrong. Error: ${err.message}. Please try again later or contact administrator. Back to <a href="/">home</a>`);
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});