import { Schema, model, Types } from "mongoose";

const CourseVideoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    videoUrl: {
        type: String,
        required: true,
        trim: true
    },
    courseId: {
        type: Types.ObjectId,
        ref: "Course",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const CourseVideos = model("CourseVideo", CourseVideoSchema);
export default CourseVideos;