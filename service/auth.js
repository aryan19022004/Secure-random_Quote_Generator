import jwt from 'jsonwebtoken'
const secret = "MONTY$123"
function setUser(user) {
    return jwt.sign(
        {
            _id:user._id,
            name:user.name,
            email:user.email
        }, secret);  // Convert to plain object
}

function getUser(token) {
    if (!token || typeof token !== "string") return null; // Agar token undefined ya invalid hai to null return karo
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return null;
    }
}


export  {
    setUser,
    getUser,
};
