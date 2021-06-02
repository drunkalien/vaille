import { Schema, Document, model, SchemaTypes, Types } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  _id?: string;
  username: string;
  email: string;
  password: string;
  profilePic?: string;
  posts?: string[];
  followers?: string[];
  following?: string[];
  likedPosts?: string[];
  likedComments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: null,
    },
    posts: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    likedPosts: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Post",
      },
    ],
    likedComments: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(user.password, 12);
    user.password = hash;
    next();
  }
  next();
});

export default model<IUser>("User", UserSchema);
