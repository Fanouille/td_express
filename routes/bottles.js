'use strict';
const Express = require('express');
const Joi = require('joi');
const Celebrate = require('celebrate');
const Passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const DB = require('../db.js');
const router = Express.Router();




router.get('/', (req, res, next) => { //pas besoin d'identification
    DB.all('SELECT * FROM BOTTLES', (err, data) => {
        if (err) {
            return next(err);
        }
        return res.json(data);
    });
});




router.get('/:id', (req, res, next) => {//pas identification
    DB.get('SELECT * FROM POSTS WHERE ID = ?', [req.params.id], (err, data) => {
        if (err) {
            return next(err);
        }
        return res.json(data);
    });
});




Passport.use(new BasicStrategy((name,password,done) =>{
    DB.get('SELECT * FROM USERS WHERE NAME = ?',[name],(err,user)=>{
        if(err){
            return done(err);
        }
        if(!user){
            return done(null,false,false);//err,auth?
        }
        if(user.PASSWORD === password){
            user.PASSWORD = undefined; 
            return done(null,user);
        }
        return done(null,false); //le mdp est mauvais
    });
}));




router.post('/', Passport.authenticate('basic',{session:false}),(req,res,user) =>{
    if(user.ROLE === 'admin'){
        Celebrate.celebrate({
            body: Joi.object().keys({
            brand: Joi.string().required(),
            price: Joi.string().required(),
            volume: Joi.string().required()
            })

        }),(req, res, next) => { //admin only 
            console.log('INSERT new bottle ' + req.body.brand);
            DB.run('INSERT INTO BOTTLES (BRAND,PRICE,VOLUME) VALUES (?, ?,?)', [req.body.brand, req.body.price,req.body.volume], (err) => {
                if (err) {
                    return next(err);
                }
                res.status(201);
                res.end();
            });
        }
    }
    //user simple, pas authorisé
    console.log("You're not an administrator.")
});

    



router.patch('/:id',Passport.authenticate('basic',{session:false}), (req, res, next) => {//all loged user 
    DB.run('UPDATE BOTTLES SET BRAND=?, PRICE=?, VOLUME=? WHERE ID = ?', [req.body.title, req.body.content, req.params.id], (err) =>{
        if (err) {
            return next(err);
        }
        res.end();
    });
});

router.delete('/:id', Passport.authenticate('basic',{session:false}),(req, res, next) => { //admin only
    if(user.ROLE === 'admin'){
        DB.run('DELETE FROM POSTS WHERE ID = ?', [req.params.id], (err) => {
            if (err) {
                return next(err);
            }
            return res.end();
        });
    }
    console.log("You're not an administrator.")
});


module.exports.router = router;
