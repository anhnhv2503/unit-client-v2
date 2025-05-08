// Post type definition
export interface PostProps {
  id: number;
  author: string;
  authorId: number;
  avatar: string;
  content: string;
  media: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  liked: boolean;
}

// Pagination information type definition
export interface Pagination {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

// Full response type definition
export interface ResponseData {
  content: PostProps[];
  page: Pagination;
}

export interface PostProp extends React.HTMLAttributes<HTMLDivElement> {
  post: PostProps;
  innerRef?: React.Ref<HTMLParagraphElement>;
  onRefresh?: () => Promise<any>;
}

export interface MediaItem {
  url: string;
  type: "image" | "video";
}

export interface UserProps {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  avatar: string;
  createdAt: string;
  role: string;
}

export type CommentProps = {
  id: number;
  content: string;
  createdAt: string;
  authorName: string;
  authorAvatar: string;
  postId: number;
  authorId: number;
};

export type SearchProps = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  avatar: string;
  createdAt: string;
  role: string;
};

export type UserProfileProps = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  avatar: string;
  createdAt: string;
};

export type NotificationProps = {
  id: number;
  content: string;
  location: string;
  type: string;
  read: boolean;
  interactorId: number;
  interactorName: string;
  interactorAvatar: string;
  postId: number;
  createdAt: string;
  postTitle: string;
};
