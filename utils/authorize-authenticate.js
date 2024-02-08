const { verifyToken } = require("./jwt")


async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication token is required" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const verifiedToken = await verifyToken(token)
    const { userId, name, phone, role, motherStall } = verifiedToken
    req.user = { userId, name, phone, role, motherStall }
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
  }
  
}

function authorizeUser(...roles){
  return function (req, res, next) {
   
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: `User role: ${req.user.role} is not authorized to access this route` }) 
    }
    next()
  }
}

module.exports = { authenticateUser, authorizeUser } 