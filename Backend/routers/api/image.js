const express = require('express');
const userController = require('../../controllers/user');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');


const imageRouter = express.Router();

imageRouter.get("/avatar/:id", (req, res) => {
    var _id = req.params.id;
    var top = 0; var left = 0;
    var width = 200; var height = 200;
    var image = "no-avatar.jpg";
    userController.get({_id: _id})
    .populate('avatar.origin')
    .then(user => {
        if(user.avatar.origin){
            image = user.avatar.origin.image;
            width = Math.max(user.avatar.size.width, 200);
            height = Math.max(user.avatar.size.height, 200)
            top = Math.min(Math.max((-user.avatar.position.y), 0), height-200);
            left = Math.min(Math.max((-user.avatar.position.x), 0), width-200);
            var newImagePath = `File/thumbnail/${path.basename(image, path.extname(image))}-${width}-${height}-${left}-${top}${path.extname(image)}`
            if(fs.existsSync(newImagePath)){
                var imageCroped = fs.readFileSync(newImagePath);
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
                res.end(imageCroped);
            }
            else{
                var data = fs.readFileSync(`File/photo/${image}`);
                sharp(data)
                .resize(width, height)
                .extract({ left: left, top: top, width: 200, height: 200 })
                .toFile(newImagePath, err => {
                    if(err){
                        res.writeHead(200, {'Content-Type': 'image/jpeg'});
                        res.end(data);
                    }
                    else{
                        var datanew = fs.readFileSync(newImagePath);
                        if(datanew){
                            res.writeHead(200, {'Content-Type': 'image/jpeg'});
                            res.end(datanew);
                        }
                        else{
                            res.writeHead(200, {'Content-Type': 'image/jpeg'});
                            res.end(data);
                        }
                    }
                })
            }
        }
        else{
            res.redirect('/photo/no-avatar.jpg');
        }
    }).catch(err => {
        res.redirect('/photo/no-avatar.jpg');
    });
});
imageRouter.get('/avatar/', (req, res) => {
    if(req.session.userInfo){
        res.redirect('/api/image/avatar/' + req.session.userInfo._id)
    }
    else{
        res.redirect('/photo/no-avatar.jpg');
    }
});
imageRouter.get("/cover/:id", (req, res) => {
    var _id = req.params.id;
    userController.get({_id: _id})
    .populate('avatar.origin')
    .then(user => {
        var data = JSON.parse(JSON.stringify(user));
        var image = data.cover.origin;
        if(image)
            res.redirect(`/photo/${image.image}`);
        else
            res.redirect('/photo/background_cover.jpg');
    }).catch(err => {
        res.json({
            success: false,
            err: err
        })
    });
});



module.exports = imageRouter;