
import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
    society: {
        type: Object,
        required: true
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
    phone: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    proofDocumentURL: {
        type: String,
        required: true
    },
    status: {
        type: String, // 'PENDING' | 'APPROVED' | 'HOLD'
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
