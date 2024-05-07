
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
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        // uppercase: true,
        trim: true
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
        max: 200,
        // Custom getter and setter
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

const Course = mongoose.model('Course', courseSchema);

// Saving Documents
async function createCourse() {
    const course = new Course({
        name: 'React Course', //req.body.name
        category: 'Web',
        author: 'Bikram',
        tags: ['frontend'],
        isPublished: true,
        price: 15.8
    });


    try {
        const result = await course.save();
        console.log(result);
    }
    catch (ex) {
        console.log(ex.message);
    }
}

// // Page of Documents and the given page
async function getCourses() {
    // Hard codint
    const pageNumber = 2;
    const pageSize = 10;

    //realworld 
    // /api/courses?pageNumber=2&pageSize=10

    const courses = await Course
        .find({ _id: '6635a1e310649563488468ad' })
        // .skip((pageNumber - 1) * pageSize)// pagination 
        // .limit(pageSize)
        .sort( {name: 1 } )
        .select({ name: 1, tags: 1, price:1 });
    console.log(courses[0].price);
};

// Updating a Document - Update First
async function updateCourse(id) {
    try {
        const result = await Course.findByIdAndUpdate( //one cmd to mongoDB and update and return it
            id,
            { $set: { author: 'Ayusha', isPublished: false } },
            { new: true } // To return the updated document
        );

        // console.log(course);
        console.log(result)
    }
    catch (e) {
        if (de instanceof mongoose.CastError)
            console.error('No course with the given ID was found.');
        else
            console.error('Something failed.');
    }
}
// Remove Documents
async function removeCourse(id) {
    try {
        const result = await Course.deleteMany({ isPublished: false });
    // const result = await Course.deleteOne({ _id: id }); //Delete one
    // const result = await Course.deleteMany({ _id: id }); //Delete many
    // const course = await Course.findByIdAndDelete(id); // if you don't have course by the given id, this method will return null.
    console.log(result);
    }
    catch (e) {
        if (de instanceof mongoose.CastError)
            console.error('No course with the given ID was found.');
        else
            console.error('Something failed.');
    }
}

getCourses();

/*
Setter is called when we set the value of a property.
getter is called when we read the value of a property
*/

