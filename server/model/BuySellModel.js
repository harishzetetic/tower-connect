
import mongoose from "mongoose";
import _ from "lodash";

const buySellSchema = new mongoose.Schema({
    images: {
        type:[String],
        required: true
    },
    title: {
        type: String,
        required:true
    },
    price: {
        type: String,
        required:true
    },
    category: {
        type: String,
        required:true,
    },
    condition: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    ownerid: {
        type: mongoose.Schema.ObjectId,
        required:true,
    },
    societyid: {
        type: mongoose.Schema.ObjectId,
        required:true,
    }, 
    isSold: {
        type: Boolean
    }
},{
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
  }
);

const BuySellModel = mongoose.model('buysell', buySellSchema);

export default BuySellModel;
