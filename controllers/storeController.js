const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer')

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, res, next) {
        const isPhoto = file.mimeType.startsWith('image/');
        if (isPhoto) {
            next(null, true)
        } else {""
            next({ message: 'That file type isn\'t allowed! ' }, false)
        }
    }
};


exports.homepage = (req, res) => {
    res.render('index')
}

exports.addStore = (req,res) => {
    res.render('editStore', {title: 'Add Store'})
};

exports.upload = multer(multerOptions).single('photo')

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body).save());
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review!`)
    res.redirect(`/store/${store.slug}`)
};

exports.getStores = async (req, res) => {
    // 1. query the database for all stores
    const stores = await Store.find();
    // console.log(stores);
    res.render('stores', {title: 'Stores', stores: stores})
}

exports.editStore = async (req, res) => {
    // 1. find the store given id 
    const store = await Store.findOne({ _id: req.params.id })
    // 2. confrim they are owners of the store
    // 3. render the edit form so the user can edit their store 
    res.render('editStore', {title: `Edit ${store.name}`, store: store});
}

exports.updateStore = async (req, res) => {
    // set the location data to be a point 
    req.body.location.type = 'Point';
    
    // 1. find and update the store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new:true, // return the new store instead of the old one 
        runValidators: true 
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`)
    res.redirect(`/stores/${store._id}/edit`)
    // 2. 
}