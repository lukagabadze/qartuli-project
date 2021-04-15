const User = require('../models/User');
const Group = require('../models/Group')
const Folder = require('../models/Folder')

const main_get = async (req, res) => {
    try{
        if(req.app.locals.user===null){
            res.redirect('/login');
            return;
        }

        let folders = {};
        if(req.app.locals.user.isTeacher === true){
            folders = await Folder.find();
        }else{
            folders = await Folder.find({'student_id': req.app.locals.user._id})
        }
        
        folders.sort(() => -1);
        res.render('main/main.ejs', {folders});
    }
    catch(err) {
        console.log(err);
    }

    // res.render('main/main.ejs')
}

const add_folder = async (req, res) => {
    const {folderName} = req.body;

    try {
        if(req.app.locals.user === null) throw { 'custom_message': 'Login is required' };
        const userId = req.app.locals.user._id;

        const folder = new Folder({
            name: folderName,
            student_id: userId,
            student_name: req.app.locals.user.username,
        });
        
        const savedFolder = await folder.save();
        res.json({folder: savedFolder});
    }
    catch(err) {
        const errors = {};

        if(err.custom_message){
            errors.name = err.custom_message;
            res.json({errors});
            return;
        }

        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
        res.json({errors});
    }
}

const folder_get = async (req, res) => {
    const folder = await Folder.findById(req.params.folder_id);
    res.render('main/folder.ejs', {folder})
}

const folder_upload_student = async (req, res) => {
    const folder = await Folder.findById(req.body.folderId);
    let newFolders = [];
    req.files.forEach(async (file) => {
        folder.student_files.push(file.filename);
        newFolders.push(file.filename);
    })
    const savedFolder = await folder.save();
    res.json({student_files: newFolders});
}

const folder_upload_teacher = async (req, res) => {
    const folder = await Folder.findById(req.body.folderId);
    let newFolders = [];
    req.files.forEach(async (file) => {
        folder.teacher_files.push(file.filename);
        newFolders.push(file.filename);
    })
    const savedFolder = await folder.save();
    res.json({teacher_files: newFolders});
}

module.exports = {
    main_get,
    add_folder,
    folder_get,
    folder_upload_student,
    folder_upload_teacher,
}



// const folder = new Folder({
//     name: 'test folder',
//     student_files: ['davaleba1', 'davaleba2', 'davaleba3', 'davaleba4'],
//     teacher_files: ['gasworebuli1', 'gasworebuli2', 'gasworebuli3'],
// })
// folder.save();


/*
!! THIS SOMEHOW FUCKING WORKS *GROUPS* !!
const gabo = await User.findOne({username: 'gabadzeluka'});
// console.log(gabo);

const group = new Group({
    name: 'pirveli jgufi',
    teacher: 'adnafinginegni',
})
const savedGroup = await group.save();

gabo.groups.push(savedGroup._id);

const savedGabo = await gabo.save();

console.log(gabo);
*/