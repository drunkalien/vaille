import mongoose from "mongoose";
import { UserData } from "../../src/User/UserClass";
import UserModel from "../../src/db/models/UserModel";
import User from "../../src/User/User";
import Post from "../../src/Post/Post";
import { PostData } from "../../src/Post/PostClass";
jest.useFakeTimers();

describe("user test", () => {
  let user: User;
  let userData: UserData;
  let post: Post;
  let postData: PostData;
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost/VAILLE_TEST", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    userData = {
      username: "john_doe",
      email: "johndoe@mail.com",
      password: "123r45",
      profilePic: "profilePic",
    };
    postData = {
      title: "Hello, World!",
      body: "Lorem ipsum dolor sit amet",
    };

    user = new User();
    post = new Post();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection("users");
    await mongoose.connection.db.dropCollection("posts");
  });

  test("creates new user", async () => {
    const newUser = await user.createUser(userData);

    expect(newUser.username).toEqual(userData.username);
    expect(newUser.email).toEqual(userData.email);
  });

  test("finds user by id", async () => {
    const mockUser = await UserModel.findOne();

    const found = await user.findUserById(mockUser?._id!);

    expect(found).toBeTruthy();
  });

  test("finds user by username", async () => {
    const mockUser = await UserModel.findOne();
    const found = await user.findUserByUsername(mockUser?.username!);

    expect(found).toBeTruthy();
  });

  test("updates user", async () => {
    const mockUser = await UserModel.findOne();
    const user = new User();
    const updateData = {
      username: "doe_john",
    };

    const updatedUser = await user.editUser(mockUser?._id!, updateData);

    expect(updatedUser?.username).toEqual(updateData.username);
  });

  test("follows user", async () => {
    const userToFollowData = {
      username: "adam_smith",
      email: "adam@gmail.com",
      password: "af;jiojaweofi;",
      followers: [],
    };

    await user.createUser(userToFollowData);
    const users = await UserModel.find();

    const currentUser = users[0];
    const userToFollow = users[1];

    await user.follow(currentUser?._id!, userToFollow?._id!);

    expect(currentUser.following![0]).toBe(userToFollow.followers![0]);
  });

  test("returns error if user tries to follow himself/herself", async () => {
    const mockUser = await UserModel.findOne();

    expect(
      async () => await user.follow(mockUser?._id!, mockUser?._id!)
    ).rejects.toThrow(Error);
  });

  test("deletes user", async () => {
    const mockUser = await UserModel.find();
    const user = new User();
    const deleted = await user.deleteUser(mockUser[0]?._id!);

    expect(deleted).toEqual(null);
  });

  test("likes a post", async () => {
    userData.username = "doe_john";
    const newPost = await post.createPost(postData);
    const newUser = await user.createUser(userData);

    await user.likePost(newPost._id!, newUser._id!);
  });
});
