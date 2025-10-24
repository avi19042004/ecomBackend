import { Request, response, Response, Router } from "express";
import { loginValidator, userValidator } from "../utils/validator";
import { validateObjectId } from "../middleware/idValidator";
import USER from "../schema/userSchema";
import bcrypt from "bcryptjs";
import { signToken, verifyToken } from "../utils/jwtUtils";

const router = Router()

router.get("/users", async (req: Request, res: Response): Promise<void> => {
    try{
        const users = await USER.find({})
        if(users.length === 0){
            res.status(404).json({message: "No Users Found"})
            return;
        }
        res.status(200).json(users);
        return;
    }catch(err){
        res.status(500).json({ message : "Internal Server Error"})
        return;
    }
})

router.post("/signin", async (req: Request, res: Response): Promise<void> => {
    try{
        const parsed = loginValidator.safeParse(req.body)
        if(!parsed.success){
            res.status(400).json({error: parsed.error})
            return;
        }

        const {email, password} = parsed.data;
        const user = await USER.findOne({email});
        if(!user){
            res.status(404).json({message: "No User Found"})
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            res.status(400).json({message: "Invalid Password"})
            return;
        }

        const token = signToken(user._id.toString());
        res.status(200).json({token, user, message: "Sign In successfull"})
        return;
    }catch(err){
        res.status(500).json({message: "Internal Server Error"})
        return;
    }
})

router.post("/signup", async (req: Request, res: Response): Promise<void> => {
    try{
        const parsed = userValidator.safeParse(req.body)
        if(!parsed.success){
            res.status(400).json({error: parsed.error})
            return;
        }
        
        const {name, email, password} = parsed.data;

        const user = await USER.findOne({email})
        if(user){
            res.status(400).json({message: "User Already Exsist, Try Login!"})
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);
        
        const newUser = new USER({name, email, password: hashPassword});
        await newUser.save()

        const token = signToken(newUser._id.toString())
        res.status(201).json({token, newUser, message: "SignUp Successful"})
    }catch(err){
        res.status(500).json({message: "Internal Server Error"})
        return;
    }
})

export default router;