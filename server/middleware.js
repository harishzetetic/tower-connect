import jwt from 'jsonwebtoken'

export const verifyToken = (request, response, next) => {
    jwt.verify(request.params.token, process.env.JWT_SECRETKEY, (err, data) => {
        if(err){
            response.send({result: "Invalid Token", isTokenValid: false})
            console.log('❌ Token Invalid')
        } else {
            console.log('👍  Token Valid')
           next()
        }
    })
}