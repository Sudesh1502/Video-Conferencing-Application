import mongoose,{Schema} from "mpongoose";

const meetingSchema = new Schema({
    u_id:{type:String, required:true, unique:true},
    meeting_id:{type:String, required:true},
    date:{type:Date, default: Date.now},
});
export const meetingModel = mongoose.model("meetings", meetingSchema);