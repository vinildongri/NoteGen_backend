import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            maxLength: [50, "your name connct exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "please enter your email"],
            unique: true,
            lowercase: true,  // normalize case
            trim: true,       // remove spaces
        },
        password: {
            type: String,
            required: [true, "Please eter your Password"],
            minLength: [6, "your password must be Langer than 6 characters"],
            select: false,
        },
        avatar: {
            public_id: String,
            url: String,
        },
        role: {
            type: String,
            default: "user",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: String,
        otpExpire: Date,

        resetPasswordToken: String,
        resetPasswordExpire: Date,

    },
    { timestamps: true }
);

//  Encrypiting Password Before Savaving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Return Jwt Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
};

// Compare User Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Reset Password token
userSchema.methods.getResetPasswordToken = async function () {
    // Generate Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // set Token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken;
};

// Generate a 6-digit OTP
userSchema.methods.getOTP = function () {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = crypto.createHash("sha256").update(otpCode).digest("hex");
    this.otpExpire = Date.now() + 15 * 60 * 1000;
    return otpCode;
};

export default mongoose.model("User", userSchema);