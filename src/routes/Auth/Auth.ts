import { Request, Response, Router } from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Owner } from '../../entities/Owner';
import { Customer } from '../../entities/Customer';
import { getRepository } from 'typeorm';

dotenv.config();
const router = Router();
const secretHash = process.env.SECRET_HASH;

// Login handler
// export const login = async (req: Request, res: Response) => {
//     const { username, password, email } = req.body;

//     // Check if the user exists
//     const user = await User.findOne({ where: { username, email } });
//     if (!user) {
//         return res.status(401).json({ message: "Invalid username or password" });
//     }

//     // Check if the password is correct
//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//         return res.status(401).json({ message: "Invalid username or password" });
//     }

//     // Generate an access token with user data
//     const accessToken = jwt.sign(
//         {
//             userId: user.id,
//             username: user.username,
//             email: user.email,
//             storeId: user.store,
//         },
//         secretHash as string,
//         { expiresIn: "45d" }
//     );

//     // Return the access token and user data in the response
//     return res.json({ accessToken, user });
// };
// Dashboard handler
export const loginToDashboard = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let owner = null;
    let customer = null;


    // Check if the owner exists
    const ownerRepository = getRepository(Owner);
    owner = await ownerRepository
        .createQueryBuilder('owner')
        .addSelect('owner.password')
        .leftJoinAndSelect('owner.permissionsCategories', 'permissionsCategories')
        .where({ email })
        .getOne();
    if (!owner) owner = null


    // Check if the customer exists
    const customerRepository = getRepository(Customer);
    customer = await customerRepository
        .createQueryBuilder('customer')
        .addSelect('customer.password')
        .leftJoinAndSelect('customer.permissionsCategories', 'permissionsCategories')
        .where({ email })
        .getOne();
    if (!customer) customer = null

    if (owner) {
        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, owner.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Generate an access token with user data
        const accessToken = jwt.sign(
            {
                userId: owner.id,
                email: owner.email,
            },
            secretHash as string,
            { expiresIn: "30d" }
        );

        // Return the access token and user data in the response
        return res.json({ accessToken, userInfo: owner });
    }

    if (customer) {
        console.log(customer)
        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, customer.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Generate an access token with user data
        const accessToken = jwt.sign(
            {
                userId: customer.id,
                email: customer.email,
            },
            secretHash as string,
            { expiresIn: "30d" }
        );

        // Return the access token and user data in the response
        return res.json({ accessToken, userInfo: customer });
    }
    return res.status(401).json({ message: "Invalid email or password" });
};

// Sign up handler
// export const signUp = async (req: Request, res: Response) => {
//     const { username, password, email } = req.body;

//     // Check if the user already exists
//     const existingUser = await User.findOne({ where: { username, email } });
//     if (existingUser) {
//         return res.status(400).json({ message: "User already exists" });
//     }

//     // Create a new user
//     const user = await User.create({
//         username,
//         password: await bcrypt.hash(password, 10),
//         email,
//     });

//     // Generate an access token with user data
//     const accessToken = jwt.sign(
//         {
//             userId: user.id,
//             username: user.username,
//             email: user.email,
//             storeId: user.store,
//         },
//         secretHash as string,
//         { expiresIn: "45d" }
//     );

//     // Return the access token and user data in the response
//     return res.json({ accessToken, user });
// };
// Dashboard handler
export const signUpToDashboard = async (req: Request, res: Response) => {
    try {
        // check is owner id exists, that means the created user is a customer
        // if owner id does not exist, that means the created user is an owner
        const { name, password, email, phone } = req.body;
        console.log({ name, password, email, phone })
        // Check if the user already exists
        const existingOwner = await Owner.findOne({ where: { name, email } });
        if (existingOwner) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user
        const newOwner = await Owner.create({
            name,
            password: await bcrypt.hash(password, 10),
            email,
            phone,
        }).save();

        // const permissionsCategories = [
        //     'Admin', 'Pos', 'Customers', 'Products', 'Orders'
        // ]

        // for (let index = 0; index < permissionsCategories.length; index++) {
        //     await PermissionCategory.create({
        //         name: permissionsCategories[index],
        //         owner: newOwner
        //     }).save();
        // }

        // Generate an access token with user data
        const accessToken = jwt.sign(
            {
                userId: newOwner.id,
                email: newOwner.email,
            },
            secretHash as string,
            { expiresIn: "30d" }
        );

        // Return the access token and user data in the response
        return res.json({
            accessToken, userInfo: {
                id: newOwner.id,
                name: newOwner.name,
                email: newOwner.email,
                phone: newOwner.phone,
                avatar: ''
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" });
    }
};


// router.route("/login").post(login);
router.route("/dashboard/login").post(loginToDashboard);
// router.route("/signup").post(signUp);
router.route("/dashboard/signup").post(signUpToDashboard);

export { router as AuthRouter };