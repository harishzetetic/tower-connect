import {verify} from 'jsonwebtoken';

export const verifyAuthorization = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        verify(token, process.env.JWT_SECRETKEY, (err, data) => {
            if(err){
                console.log('❌ Token Invalid')
                return response.status(401).json({result: "Invalid Token", isTokenValid: false})
            } else {
                console.log('👍  Token Valid')
               next()
            }
        })
       
      }
    
}