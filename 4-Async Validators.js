// How to convert asynchronous validator to synchronous one?

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// shape of an object
const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255,
        // match: /pattern/
    }, // required value validator in mongodb, only meaningful to mongoDB
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network']
    },
    author: String,

    // implement Async validator
    tags: {
        type: Array,
        validate: {
            validator: function(v) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        // Do some async work
                        const result = v && v.length > 0;
                        resolve(result);
                    }, 4000);
                });
            },
            message: 'A course should have at least one tag.'
        }
    },
    
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished; }, 

        // two validators 
        min: 10, 
        max: 200
    }
});

const Course = mongoose.model('Course', courseSchema);

// Saving Documents
async function createCourse() {
    const course = new Course({
        name: 'React Course', //req.body.name
        category: 'web',
        author: 'Bikram',
        tags: null, // what happen if we exclude this property
        isPublished: true,
        price: 15
    });


    try {
        const result = await course.save();
        console.log(result);
    }
    catch (ex) {
        console.log(ex.message);
    }
}

createCourse();


