// import express from 'express';

// const router = express.Router();

// router.post('/register',(req,res)=>{
//     res.status(200).json({
//         message:"register Api working"
//     });
// });

// router.post('/login', (req,res)=>{
//     res.status(200).json({
//         message:"login api working"
//     })
// })

// export default router;

import express from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;