export interface PostData {
  _id?: string;
  title?: string;
  body: string;
  image?: string;
  comments?: string[];
  likes?: number;
  author?: string;
}

export default class PostClass {
  _id?: string;
  title?: string;
  body: string;
  image?: string;
  comments?: string[];
  likes?: number;
  author?: string;

  constructor(postData: PostData) {
    this.title = postData.title;
    this.body = postData.body;
    this.image = postData.image;
    this.comments = postData.comments;
    this.likes = postData.likes;
    this.author = postData.author;
  }

  public validate(): boolean {
    const props = [
      this.title,
      this.body,
      this.image,
      this.comments,
      this.likes,
      this.author,
    ];

    for (let prop of props) {
      if (prop === "") {
        return false;
      }
    }

    return true;
  }
}
