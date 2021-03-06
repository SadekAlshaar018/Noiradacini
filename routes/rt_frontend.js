const express = require('express');
const router  = express.Router();

// Load Controllers
const Bundel = require('../models/mdl_bundel');
const Page = require('../models/mdl_page');
const Setting = require('../models/mdl_site');


// Interview
router.get('/:lang/interview/:id', (req , res ) => {
    const querystring = require('querystring');

    Bundel.find({_id:req.params.id}).then(bundels => {
        Page.find({language: req.params.lang})
                .then(pages=>{
                    Setting.find()
                        .then( result => {
                            var settings = {};
                            result.forEach( item => {
                                settings[item.setting_key] = item.setting_value
                            })
                            res.render('frontend/interview',
                                        {
                                            item: bundels[0],
                                            fullUrl: settings.site_host  + req.originalUrl,
                                            encodedName: querystring.escape(bundels[0].name),
                                            personImage: querystring.escape(settings.site_host  + '/' + bundels[0].mainImage),
                                            pages: pages,
                                            settings: settings
                                        });
                        }).catch(err=>console.log(err));
                }).catch(err=>console.log(err));
    }).catch(err=>{
        console.log(err);
    });
});

// Page
router.get('/:lang/:page', (req, res) => {
    const querystring = require('querystring');

    Page.find({language: req.params.lang, slugName: req.params.page}).then(item=>{
        Page.find({language: req.params.lang})
                .then(pages=>{
                    Setting.find()
                        .then( result => {
                            var settings = {};
                            result.forEach( item => {
                                settings[item.setting_key] = item.setting_value
                            })
                            res.render('frontend/page',
                                        {
                                            item: item[0],
                                            fullUrl: settings.site_host  + req.originalUrl,
                                            pages: pages,
                                            settings: settings
                                        });
                        }).catch(err=>console.log(err));
                }).catch(err=>console.log(err));
    }).catch( err=> console.log(err) );
});

// Home
router.get('/', (req, res) => {
    Setting.findOne({'setting_key': 'site_def_language'}).then( result => {
        var lang = (req.query.lang) ? req.query.lang : result.setting_value;
        res.render('frontend/index', {language: lang});
    }).catch( err => console.log(err) );
});

module.exports = router;
