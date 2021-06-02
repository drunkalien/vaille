import { GraphQLString } from "graphql";
import { PostType } from "../TypeDefs/PostType";
import { PostInputType } from "../TypeDefs/PostInputType";
import Post from "../../Post/Post";

const post = new Post();
const addPost = {
  type: PostType,
  args: {
    data: { type: PostInputType },
  },
  async resolve(parent: any, args: any) {
    return await post.createPost(args.data);
  },
};

const deletePostById = {
  type: PostType,
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    return await post.deletePost(args.id);
  },
};

const updatePost = {
  type: PostType,
  args: {
    id: { type: GraphQLString },
    data: { type: PostInputType },
  },
  async resolve(parent: any, args: any) {
    return await post.updatePost(args.id, args.data);
  },
};

export { addPost, deletePostById, updatePost };
