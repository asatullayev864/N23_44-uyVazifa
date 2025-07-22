import { Schema, model, Types } from "mongoose";

const CourseSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    ownerId: {
        type: Types.ObjectId,
        ref: "Owner",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Course = model("Course", CourseSchema);
export default Course;