const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'please enter a store name'
    },
    slug: String,
    description:{
        type:String,
        trim: true 
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'You must supply coordinates!'
        }],
        address: {
            type: String,
            required: 'You must supply an address!'
        }
    },
    photo: String
});

storeSchema.pre('save', async function(next){
    if(!this.isModified('name')){
        next(); // skip it
        return; // stop this function from running! 
    }
    this.slug = slug(this.name);
    // check if there is a store with the same name! example: hezema -> hezema-1 -> hezema-2. So we need regex to check that 
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if(storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1 }`
    }

    next();
})

module.exports = mongoose.model('Store', storeSchema)