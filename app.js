const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Set storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req,file,cb) {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

//Init upload

const upload = multer({
    storage: storage,
    limits: {fileSize: 10000000 },
    fileFilter: function (req,file,cb) {
        checkFileType(file,cb);
    }
}).single('myImage');


//Check File Type
function checkFileType(file,cb) {
    //Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    //Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb('Err:Images Only!!');
    }

}

//init app
const app = express();

app.set('view engine','ejs');

//Public folder
app.use(express.static('./public'));

app.get('/',(req,res) => res.render('index'));

app.post('/upload',(req,res)=>{
    upload(req,res,(err) =>{
        if(err){
            res.render('index',{
                msg: err
            })
        }
        else {
            if(req.file == undefined){
                res.render('index',{
                    msg: 'Error: No file Selected'
                });
            }
            else{
                res.render('index',{
                    msg: 'File Uploades',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

const port = 3000;

app.listen(port, ()=>console.log(`Server started on port ${port}`));