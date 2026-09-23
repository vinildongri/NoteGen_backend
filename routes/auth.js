import express from "express";
import { authorizeRole, isAuthenticatedUser } from "../middleware/auth.js";
import { 
    allUsers,
    deleteUser,
    forgotPassword, 
    getUserDetails, 
    getUserProfile, 
    loginUser, 
    logout, 
    registerUser, 
    resendOTP, 
    resetPassword, 
    updateDetails, 
    updatePassword, 
    updateProfile,
    verifyOTP
} from "../controllers/authController.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/password/update").put( isAuthenticatedUser, updatePassword);
router.route("/me/update").put( isAuthenticatedUser, updateProfile);

router
    .route("/admin/users")
    .get( isAuthenticatedUser, authorizeRole("admin"), allUsers);


router
    .route("/admin/users/:id")
    .get(isAuthenticatedUser, authorizeRole("admin"), getUserDetails)
    .put(isAuthenticatedUser, authorizeRole("admin"), updateDetails)
    .delete(isAuthenticatedUser, authorizeRole("admin"), deleteUser);

export default router;