
import mongoose from "mongoose";

const societySchema = new mongoose.Schema({
    builderName: {
        type:String,
        required: true
    },
    societyName: {
        type: String,
        required:true
    },
    country: {
        type: String,
        required:true
    },
    state: {
        type: String,
        required:true
    },
    city: {
        type: String,
        required:true
    },
    pin: {
        type: Number,
        required:true
    },
    addressline2: {
        type: String,
        required:true
    },
    addressline1: {
        type: String,
        required:true
    }
});

const SocietyModel = mongoose.model('societies', societySchema);

export default SocietyModel;
