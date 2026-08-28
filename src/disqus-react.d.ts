declare module 'disqus-react' {
  import * as React from 'react';

  export interface DiscussionEmbedConfig {
    url?: string;
    identifier?: string;
    title?: string;
    language?: string;
    category_id?: string;
    onNewComment?: (comment: any) => void;
  }

  export interface DiscussionEmbedProps {
    shortname: string;
    config: DiscussionEmbedConfig;
  }

  export class DiscussionEmbed extends React.Component<DiscussionEmbedProps> {}

  export interface CommentCountProps {
    shortname: string;
    config: DiscussionEmbedConfig;
    children?: React.ReactNode;
  }

  export class CommentCount extends React.Component<CommentCountProps> {}

  export interface CommentEmbedProps {
    commentId: string;
    showMedia?: boolean;
    showParentComment?: boolean;
    width?: number | string;
    height?: number | string;
  }

  export class CommentEmbed extends React.Component<CommentEmbedProps> {}
}
