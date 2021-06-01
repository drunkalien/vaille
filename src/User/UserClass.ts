export interface UserData {
  username: string;
  email: string;
  password: string;
  profilePic?: string;
  posts?: string[];
  followers?: string[];
  following?: string[];
  likedPosts?: string[];
  likedComments?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default class UserClass {
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
  createdAt?: Date;
  updatedAt?: Date;
  constructor(userData: UserData) {
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password;
    this.profilePic = userData.profilePic;
    this.posts = userData.posts;
    this.followers = userData.followers;
    this.following = userData.following;
    this.likedPosts = userData.likedPosts;
    this.likedComments = userData.likedComments;
    this.createdAt = userData.createdAt;
    this.updatedAt = userData.updatedAt;
  }

  validate(): boolean {
    const props = [
      this.username,
      this.email,
      this.password,
      this.profilePic,
      this.posts,
      this.followers,
      this.following,
      this.likedPosts,
      this.likedComments,
      this.createdAt,
      this.updatedAt,
    ];
    for (let prop of props) {
      if (prop === "") {
        return false;
      }
    }
    return true;
  }
}
