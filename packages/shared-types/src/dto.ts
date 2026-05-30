import type { ReactionType, MfsProvider, VisibilityScope, ReportCode } from './enums';

export interface SendOtpDto {
  phoneNumber: string;
}

export interface VerifyOtpDto {
  phoneNumber: string;
  otp: string;
}

export interface CreateProfileDto {
  legalName: string;
  handle: string;
  districtId: number;
  subDistrictId: number;
}

export interface UpdateProfileDto {
  displayName?: string;
  bio?: string;
  pronouns?: string;
  avatarUrl?: string;
  coverUrl?: string;
  districtId?: number;
  subDistrictId?: number;
  visibility?: VisibilityScope;
  language?: string;
  theme?: string;
  fontScale?: string;
  highContrast?: boolean;
  reducedMotion?: boolean;
  autoImageAlt?: boolean;
}

export interface CreatePostDto {
  content?: string;
  contentMarkdown?: boolean;
  locationName?: string;
  districtId?: number;
  subDistrictId?: number;
  visibility?: VisibilityScope;
  mediaAssetIds?: string[];
  hashtagNames?: string[];
}

export interface UpdatePostDto {
  content?: string;
}

export interface CreateCommentDto {
  postId: string;
  parentId?: string;
  content: string;
}

export interface ReactToPostDto {
  postId: string;
  type: ReactionType;
}

export interface SendMessageDto {
  conversationId: string;
  content?: string;
  type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE';
  mediaUrl?: string;
  replyToId?: string;
  voiceDuration?: number;
}

export interface CreateCommunityDto {
  name: string;
  description?: string;
  category: string;
  districtId?: number;
  subDistrictId?: number;
  visibility?: VisibilityScope;
  joinType?: string;
}

export interface CreateMarketplaceItemDto {
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  districtId?: number;
  subDistrictId?: number;
  isNegotiable?: boolean;
}

export interface CreatePaymentDto {
  receiverId?: string;
  fundraiserId?: string;
  type: 'P2P_TRANSFER' | 'FUND_REQUEST' | 'ESCROW_LOCK' | 'FUNDRAISER_DONATION';
  amount: number;
  provider: MfsProvider;
  description?: string;
}

export interface CreateReportDto {
  type: 'POST' | 'COMMENT' | 'USER' | 'MARKETPLACE_ITEM' | 'COMMUNITY';
  code: ReportCode;
  description?: string;
  postId?: string;
  commentId?: string;
  reportedUserId?: string;
}

export interface SearchQueryDto {
  q: string;
  type?: 'users' | 'posts' | 'hashtags' | 'communities' | 'all';
  page?: number;
  limit?: number;
}
