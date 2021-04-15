const {Router} = require('express');
const router = Router();
const mainController = require('../controllers/mainController');

const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `./public/images/${req.body.studentName}/`;
        if(!fs.existsSync(dir)){
            fs.mkdir(dir, async (err) => {
                cb(null, dir);
            })
        }else{
            cb(null, dir);
        }
    },
    filename: (req, file, cb) => {
        let folderName = req.body.folderName;

        let originalName = file.originalname;
        let str = '';
        for(let i=originalName.length-1; i>=0; i--){
            str += originalName[i];
            if(originalName[i]==='.'){
                originalName = originalName.slice(0, i);
                break;
            }
        }
        const exstension = str.split("").reverse().join("");
        folderName = folderName.split("  ").join('_');
        cb(null, `${req.app.locals.user.username}__${folderName}__${Date.now()}${exstension}`);
    },
})
const upload = multer({storage})

router.get('/', mainController.main_get);
router.post('/add-folder', mainController.add_folder);
router.get('/folder/:folder_id', mainController.folder_get);
router.post('/folder/upload_student', upload.array('files'), mainController.folder_upload_student);
router.post('/folder/upload_teacher', upload.array('files'), mainController.folder_upload_teacher);


module.exports = router;




/*
*DIS SOME GOOD SHIT*
        let originalName = file.originalname;
        let str = '';
        for(let i=originalName.length-1; i>=0; i--){
            str += originalName[i];
            if(originalName[i]==='.'){
                originalName = originalName.slice(0, i);
                break;
            }
        }
        const exstension = str.split("").reverse().join("");
        cb(null, `${req.app.locals.user.username}__${originalName}__${Date.now()}${exstension}`)
*/