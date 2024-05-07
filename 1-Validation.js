
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// shape of an object
const courseSchema = new mongoose.Schema({
    name: { type: String, required: true }, // only meaningful to mongoDB
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

// Saving Documents
async function createCourse() {
    const course = new Course({
        // name: 'React Course', //req.body.name
        author: 'Bikram',
        tags: ['react', 'Frontend'],
        isPublished: true
    });


    try {
        const result = await course.save();
        console.log(result);
    }
    catch (ex) {
        console.log(ex.message);
    }
}

// createCourse();

// // Page of Documents and the given page
// async function getCourses() {
//     // Hard codint
//     const pageNumber = 2;
//     const pageSize = 10;

//     //realworld 
//     // /api/courses?pageNumber=2&pageSize=10

//     const courses = await Course
//         .find({ author: 'Bikram', isPublished: true })
//         .skip((pageNumber - 1) * pageSize)// pagination 
//         .limit(pageSize)
//         .sort( {name: 1 } )
//         .count()
//     console.log(courses);
// }

// // Updating a Document - Update First
// async function updateCourse(id) {
//     const result = await Course.findByIdAndUpdate( //one cmd to mongoDB and update and return it
//         id,
//         { $set: { author: 'Ayusha', isPublished: false } },
//         { new: true } // To return the updated document
//     );

//     // console.log(course);
//     console.log(result)
// }

// // Remove Documents
// async function removeCourse(id) {
//     // const result = await Course.deleteOne({ _id: id }); //Delete one
//     // const result = await Course.deleteMany({ _id: id }); //Delete many
//     const course = await Course.findByIdAndDelete(id); // if you don't have course by the given id, this method will return null.
//     console.log(course);
// }

createCourse();
