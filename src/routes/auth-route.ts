import express, {Request, Response} from 'express';
import passport from 'passport';

const router = express.Router();

//google
router.get('/login/google', passport.authenticate("google",  { scope: ['profile', 'email'] }));
router.get('/redirect/google', passport.authenticate('google', { failureRedirect: '/', failureMessage: true }), (req, res) => res.redirect('/'));

//facebook
router.get('/login/facebook', passport.authenticate("facebook", { scope: [ 'email' ] }));
router.get('/redirect/facebook', passport.authenticate('facebook', { failureRedirect: '/', failureMessage: true }), (req, res) => res.redirect('/'));


//twitter
router.get('/login/twitter', passport.authenticate("twitter"));
router.get('/redirect/twitter', passport.authenticate('twitter', { failureRedirect: '/', failureMessage: true }), (req, res) => res.redirect('/'));

//linkedin
router.get('/login/linkedin', passport.authenticate("linkedin"));
router.get('/redirect/linkedin', passport.authenticate('linkedin', { failureRedirect: '/', failureMessage: true }), (req, res) => res.redirect('/'));

//logout
router.get('/logout', (req, res) => { 
  req.session.destroy((err) => {
    if (err) {
      throw err;
    } else {
      res.redirect('/'); 
    }
  });
});
export default router;