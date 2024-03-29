
import mongoose from "mongoose";
import { Schema } from "mongoose";

export const ownerSchema = new mongoose.Schema({
    societyId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'socities'
    },
    towerNumber: {
        type: String,
        required: true
    },
    flatNumber: {
        type: String,
        required: true
    },
    flatType: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean
    },
    phone: {
        type: String,
        required: true,
    },
    isPhoneVerified: {
        type: Boolean
    },
    imageUrl: {
        type: String,
    },
    proofDocumentURL: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    other: {
        type: Object,
    }
});

const OwnerModal = mongoose.model('owners', ownerSchema);

export default OwnerModal;
