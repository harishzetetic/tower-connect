import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const USERNAME = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DBConnection = async () =>{
    // Debug: Check if environment variables are loaded
    console.log('DB_USER:', USERNAME ? 'Set' : 'Not set');
    console.log('DB_PASSWORD:', PASSWORD ? 'Set' : 'Not set');
    
    const URL = `mongodb+srv://${USERNAME}:${PASSWORD}@tower-connect.nuxtnmz.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`
    console.log('Connection URL:', URL.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    try{
        await mongoose.connect(URL, {useUnifiedTopology: true});
        console.log('✅ Databse connected successfully');
    }catch(e){
        console.log('❌ Error in connected Databse', e)
    }
}

export default DBConnection