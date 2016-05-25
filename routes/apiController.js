'use strict';

function apiController(dao) {
    var express = require('express');
    var router = express.Router();

    router.get('/pets', onGetPets);
    router.post('/pet', onPostPet);
    router.delete('/pet', onDeletePet);
    router.put('/pet', onEditPet);
    router.get('/messages', onGetMessages);
    router.post('/send', onSendMessage);
    router.post('/reply', onReplyMessage);

    return router;

    function onGetPets(req, res) {
        // TODO miri
    }

    function onPostPet(req, res) {
        var props = ['name', 'description', 'age', 'species', 'type', 'gender'];
        var data = {};
        props.forEach(function (prop) {
            if (req.body[prop]) {
                data[prop] = req.body[prop];
            }
        });
        data.user = req.user._id;
        dao.pet.create(data, onPetCreated);

        function onPetCreated(error, result) {
            if (error || !result) {
                res.status('400').json({msg: 'Bad request. Check for missing parameters.'});
            } else {
                res.json(result);
            }
        }
    }

    function onDeletePet(req, res) {
        // ????
        var data = req.body;
        var petId = req.body.pet;
        var user = req.user;

        dao.pet.find({_id: petId, user: user._id}).remove(data, onPetDeleted);

        function onPetDeleted(error, result){
            if (error || !result) {
                res.status('400').json({msg: 'Bad request. Check for missing parameters.'});
            } else {
                res.json(result);
            }
        }
    }

    function onEditPet(req, res) {
        // TODO miri
        var props = ['name', 'description', 'age', 'species', 'type', 'gender'];
        var data = {};
        var petId = req.body.pet;
        var user = req.user;

        props.forEach(function (prop) {
            if (req.body[prop]) {
                data[prop] = req.body[prop];
            }
        });

         // not sure if correct - the data part.
        dao.pet.findOneAndUpdate({_id: petId,  user: user._id},data /* ?? */, {returnNewDocument: true},onUpdatePet);

        function onUpdatePet(error, result){
            if (error || !result) {
                res.status('400').json({msg: 'Bad request. Check for missing parameters.'});
            } else {
                res.json(result);
            }
        }

    }

    function onGetMessages(req, res) {
        // TODO miri
    }

    function onSendMessage(req, res) {
        // TODO miri
    }

    function onReplyMessage(req, res) {
        // TODO miri
    }
}

module.exports = apiController;