import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const USERNAME = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const Connection = async () =>{
    const URL = `mongodb+srv://${USERNAME}:${PASSWORD}@tower-connect.nuxtnmz.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`
    try{
        await mongoose.connect(URL, {useUnifiedTopology: true});
        console.log('Databse connected successfully ❤️');
    }catch(e){
        console.log('Error in connected Databse', e)
    }
}

export default Connection