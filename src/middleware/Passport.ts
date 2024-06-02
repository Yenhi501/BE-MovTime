import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { User } from "../models/User";
import Container from "typedi";
import { UserService } from "../services/UserService";
import { AuthenticationService } from "../services/AuthenticationService";
import { rescheduleJob } from "node-schedule";
const GoogleStrategy = passportGoogle.Strategy;

require('dotenv').config();
const userService = Container.get(UserService);
const authenticationService = Container.get(AuthenticationService);

passport.use(
  new GoogleStrategy(
    {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.CLIENT_URL+"/google",
    passReqToCallback: true
    },
    async function (req,accessToken, refreshToken, profile, cb)  {
        try { 
            const profileJson = profile._json
            if (profileJson.sub && profileJson.email) {
              const user = await userService.findOneUserByEmail(profileJson.email);
              if(user){
                if(!user.active){
                  await userService.activeUser(user.userId)
                }
                req.payload = user
                return cb(null,user)
              }else{
                await authenticationService.register(profileJson.email,new Date(),"Other",profileJson.email,generateRandomString(16))
                let user = await userService.findOneUserByEmail(profileJson.email);
                await userService.activeUser(user.userId)
                req.payload = user
                return cb(null,user)
              }
            }else{
              return cb(null,undefined)
            }
        } catch (error) {
            console.log(error)
        }
    }
  )
);

function generateRandomString(length:number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
