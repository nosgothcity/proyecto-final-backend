import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import UserModel from '../models/schemas/user.schemas.js';
import config from './config.js';

const initializePassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: config.passport.clientID,
        clientSecret: config.passport.clientSecret,
        callbackURL: config.passport.callbackURL,
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
                const user = await UserModel.findOne({ email: profile._json.email });
                if (!user) {
                    const newUser = {
                        firstname: profile._json.name,
                        lastname: '', 
                        email: profile._json.email, 
                        age: 30,
                        password: '',
                        role: 'user',
                    };
                    const result = await UserModel.create(newUser);
                    done(null, result);
                } else {
                    done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const {firstname, lastname, age} = req.body
            console.log('creando un nuevo usuario....');
            try {
                const user = await UserModel.findOne({ email: username });
                if (user) {
                    return done(null, false, { message: 'Correo electrónico incorrecto.' });
                }
                let role = 'user';
                if(username === 'adminCoder@coder.com'){
                    role = 'admin';
                    console.log('El usuario es admin....');
                }
                const newUser = {
                    firstname, 
                    lastname, 
                    email: username, 
                    age, 
                    password: createHash(password),
                    role,
                };

                const result = await UserModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('login',new LocalStrategy({ usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Correo electrónico incorrecto.' });
                }

                const passwordMatch = isValidPassword(user, password);
                if (!passwordMatch) {
                    return done(null, false, { message: 'Contraseña incorrecta.' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;
