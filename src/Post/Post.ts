import PostClass, { PostData } from "./PostClass";
import PostModel from "../db/models/PostModel";

export default class Post {
  public async createPost(postData: PostData): Promise<PostClass> {
    const post = new PostClass(postData);
    if (!post.validate()) {
      throw new Error("Post validation failed!");
    }
    const created = await PostModel.create(post);
    post._id = created._id;
    return post;
  }

  public async allPosts() {
    const posts = await PostModel.find().populate("author");
    return posts;
  }

  public async findPostById(postId: string) {
    const post = await PostModel.findById(postId).populate("author");
    if (!post) {
      throw new Error("Invalid post id!");
    }

    return post;
  }

  public async updatePost(postId: string, data: object): Promise<object> {
    const post = await PostModel.findByIdAndUpdate(postId, data, { new: true });

    if (!post) {
      throw new Error("Invalid post id!");
    }

    return post;
  }

  public async deletePost(postId: string): Promise<null> {
    const post = await PostModel.findByIdAndDelete(postId);
    if (!post) {
      throw new Error("Invalid post id!");
    }

    return null;
  }
}
