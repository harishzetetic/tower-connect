
import OwnerModal from "../model/OwnerModel.js";
import { AccountStatus } from "../constants.js";
import jwt from 'jsonwebtoken'

export const addOwner = async (request, response) => {
    try{
        /*
            // TO DELETE EVERYTHING FROM OWNER MODAL
            await OwnerModal.deleteMany({})
            return response.status(200).json({message: "Deleted everything from owner collection"})
            return;
        */
            
        const {destination, filename} = request.file;
        const userProofDocumentFilePath = `${destination}${filename}`;
       
        let exist = await OwnerModal.findOne({society: request.body.society, towerNumber: request.body.towerNumber, flatNumber: request.body.flatNumber});
        if(exist){
            switch(Number(exist.status)){
                case AccountStatus.PENDING:
                    return response.status(200).json({message: "Duplicate application found"}) 
                case AccountStatus.SUSPENDED:
                    return response.status(200).json({message: "Applied property has already been registered with us but for some reasons it got suspended. If you are applying again. Kindly delete your account by login first and apply again."})
                case AccountStatus.APPROVED:
                    return response.status(200).json({message: `Applied property is already being registered with us from the owner "${exist.firstName} ${exist.lastName}"`})
            }
        } else {
            const newOwner = new OwnerModal({
                society: request.body.society,
                towerNumber: request.body.towerNumber,
                flatNumber: request.body.flatNumber,
                flatType: request.body.flatType,
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                email: request.body.email,
                phone: request.body.phone,
                imageUrl: request.body.imageUrl,
                proofDocumentURL: userProofDocumentFilePath,
                status: AccountStatus.PENDING,
                password: request.body.password,
                other: {}
            });
            await newOwner.save();
            return response.status(200).json({owner: newOwner})
        }
        
    }catch(e){
        return response.status(500).json(e)
    }
}

export const verifyToken = (request, response, next) => {
    jwt.verify(request.params.token, process.env.JWT_SECRETKEY, (err, data) => {
        if(err){
            response.send({result: "Invalid Token", loginStatus: false})
            console.log('Token Invalid')
        } else {
            console.log('Token Valid')
           next()
        }
    })
}

export const deleteOwner = async(request, response) => {
    try{
        console.log(request.params)
        // await OwnerModal.deleteOne({_id: request.params.id})
        // return response.status(200).json({message: "SUCCESS"})
    }catch(e){
        return response.status(500).json(e)
    }
}


