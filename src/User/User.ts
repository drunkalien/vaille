import UserModel from "../db/models/UserModel";
import UserClass, { UserData } from "./UserClass";
import Post from "../Post/Post";

export default class User {
  public async createUser(userData: UserData): Promise<UserClass> {
    const user = new UserClass(userData);
    if (!user.validate()) {
      throw new Error("User validation failed!");
    }

    const created = await UserModel.create(user);
    user._id = created._id;
    return user;
  }

  public async findUserById(userId: string): Promise<UserClass> {
    const user = await UserModel.findById(userId)
      .populate("posts")
      .populate("followers")
      .populate("following")
      .populate("likedPosts");

    if (!user) {
      throw new Error("User id invalid!");
    }

    const doc = new UserClass(user);
    doc._id = user._id;

    return doc;
  }

  public async findUserByUsername(username: string): Promise<UserClass> {
    const user = await UserModel.findOne({ username })
      .populate("posts")
      .populate("followers")
      .populate("following")
      .populate("likedPosts");

    if (!user) {
      throw new Error("Invalid username!");
    }

    const doc = new UserClass(user!);
    doc._id = user?._id;
    return doc;
  }

  public async editUser(userId: string, data: object): Promise<UserClass> {
    let editedUser = await UserModel.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
    });

    if (!editedUser) {
      throw new Error("User id invalid!");
    }
    editedUser._id = userId;
    return new UserClass(editedUser);
  }

  public async deleteUser(userId: string): Promise<null> {
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("Invalid user id!");
    }

    return null;
  }

  public async follow(currentUserId: string, userToFollowId: string) {
    const currentUser = await this.findUserById(currentUserId);
    const userToFollow = await this.findUserById(userToFollowId);

    if (!currentUser || !userToFollow) {
      throw new Error("Invalid id for current user or user to follow!");
    }

    if (currentUserId === userToFollowId) {
      throw new Error("Users cannot follow themselves");
    }

    await this.editUser(currentUserId, {
      following: [...currentUser?.following!, userToFollowId],
    });

    await this.editUser(userToFollowId, {
      followers: [...userToFollow?.followers!, currentUserId],
    });
  }

  public async likePost(postId: string, userId: string) {
    const post = new Post();
    const foundPost = await post.findPostById(postId);
    const user = await this.findUserById(userId);

    if (!foundPost || !user) {
      throw new Error("Invalid credentials!");
    }

    await this.editUser(userId, {
      likedPosts: [...user?.likedPosts!, postId],
    });

    await post.updatePost(postId, {
      likes: foundPost.likes! + 1,
    });
  }

  public async unFollow(currentUserId: string, userToUnFollowId: string) {
    await UserModel.updateOne(
      { _id: currentUserId },
      { $pull: { following: userToUnFollowId } },
      { new: true }
    );

    await UserModel.updateOne(
      { _id: userToUnFollowId },
      { $pull: { followers: currentUserId } },
      { new: true }
    );
  }

  public async unlike(userId: string, postId: string) {
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { likedPosts: postId } }
    );
    const post = new Post();
    const foundPost = await post.findPostById(postId);
    await post.updatePost(postId, {
      likes: foundPost.likes! - 1,
    });
  }
}
