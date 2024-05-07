
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

    // custom validator
    tags: {
        type: Array,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            }, 
            // we can also set the custom message
            message: 'A course should have at least one tag.'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished; }, // In this particular case, we cannot replace this function
        // with an arrow function. In other words, if we delete function our validator will not work.
        // Because arrow functions don't have thieir own this. They use the this value of the in closing execution context..
        // So in this particular case, there is a function somewhere in Mongoose that is going to call this function.
        // This -{ return this.isPublished; } reference right here will reference that function.
        // not the course object we're dealing with here. 

// Note:-
// Required Validator:- we can set that to a simple boolean, or, a function to conditionally 
// make a property required.

// Depending on the type of properties we have, we have additional built-in validators.
// for example we also have min lwngth and max length.

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


