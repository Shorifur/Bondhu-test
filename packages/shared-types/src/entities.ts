import type {
  VisibilityScope,
  VerificationType,
  AppLanguage,
  AppTheme,
  FontScale,
  ReactionType,
  StoryType,
  MessageType,
  CommunityCategory,
  CommunityRole,
  MembershipStatus,
  ItemCondition,
  PaymentStatus,
  MfsProvider,
  EscrowStatus,
  NotificationType,
  AlertRate,
  ReportCode,
  MediaType,
} from './enums';

export interface User {
  id: string;
  phoneNumber: string;
  phoneVerified: boolean;
  email?: string | null;
  emailVerified: boolean;
  isGuest: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  profile?: UserProfile | null;
}

export interface UserProfile {
  id: string;
  userId: string;
  legalName: string;
  displayName: string;
  handle: string;
  bio?: string | null;
  pronouns?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  districtId?: number | null;
  subDistrictId?: number | null;
  district?: District | null;
  subDistrict?: SubDistrict | null;
  visibility: VisibilityScope;
  verificationType?: VerificationType | null;
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  websiteUrl?: string | null;
  whatsappNumber?: string | null;
  isPrivate?: boolean;
  language: AppLanguage;
  theme: AppTheme;
  fontScale: FontScale;
  highContrast: boolean;
  reducedMotion: boolean;
  autoImageAlt: boolean;
}

export interface Post {
  id: string;
  userId: string;
  content?: string | null;
  contentMarkdown: boolean;
  locationName?: string | null;
  districtId?: number | null;
  subDistrictId?: number | null;
  visibility: VisibilityScope;
  isPinned: boolean;
  isArchived: boolean;
  isEdited: boolean;
  editedAt?: string | null;
  commentCount: number;
  reactionCount: number;
  shareCount: number;
  bookmarkCount: number;
  score: number;
  createdAt: string;
  user?: UserProfile;
  mediaAssets?: MediaAsset[];
  hashtags?: Hashtag[];
  poll?: Poll | null;
  myReaction?: ReactionType | null;
  isBookmarked?: boolean;
}

export interface MediaAsset {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string | null;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  mimeType: string;
  altText?: string | null;
  orderIndex: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentId?: string | null;
  content: string;
  isEdited: boolean;
  editedAt?: string | null;
  reactionCount: number;
  replyCount: number;
  depth: number;
  createdAt: string;
  user?: UserProfile;
  replies?: Comment[];
}

export interface Poll {
  id: string;
  postId: string;
  expiresAt: string;
  totalVotes: number;
  options: PollOption[];
  hasVoted?: boolean;
  myVoteOptionId?: string | null;
}

export interface PollOption {
  id: string;
  pollId: string;
  orderIndex: number;
  text: string;
  voteCount: number;
}

export interface Hashtag {
  id: string;
  tag: string;
  phoneticKey: string;
  postCount: number;
  trendingScore: number;
}

export interface Story {
  id: string;
  userId: string;
  type: StoryType;
  expiresAt: string;
  locationName?: string | null;
  viewCount: number;
  createdAt: string;
  mediaAssets: MediaAsset[];
  hasViewed?: boolean;
  user?: User;
}

export interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP';
  title?: string | null;
  avatarUrl?: string | null;
  lastMessageAt?: string | null;
  participants: ConversationParticipant[];
  lastMessage?: DirectMessage | null;
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  unreadCount: number;
  lastReadAt?: string | null;
  isMuted: boolean;
  user?: UserProfile;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string | null;
  type: MessageType;
  content?: string | null;
  mediaUrl?: string | null;
  voiceDuration?: number | null;
  voicePlaybackSpeed: number;
  replyToId?: string | null;
  forwardedFromId?: string | null;
  isDeleted: boolean;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  sender?: UserProfile;
  replyTo?: DirectMessage | null;
}

export interface Community {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  category: CommunityCategory;
  districtId?: number | null;
  subDistrictId?: number | null;
  visibility: VisibilityScope;
  joinType: 'OPEN' | 'APPROVAL_REQUIRED' | 'INVITE_ONLY';
  memberCount: number;
  postCount: number;
  isVerified: boolean;
  createdAt: string;
  myRole?: CommunityRole | null;
  myMembershipStatus?: MembershipStatus | null;
}

export interface MarketplaceItem {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: ItemCondition;
  category: string;
  districtId?: number | null;
  subDistrictId?: number | null;
  visibility: string;
  isNegotiable: boolean;
  isVerifiedSeller: boolean;
  isSold: boolean;
  viewCount: number;
  createdAt: string;
  seller?: User;
  mediaAssets?: MediaAsset[];
}

export interface Payment {
  id: string;
  senderId: string;
  receiverId?: string | null;
  type: 'P2P_TRANSFER' | 'FUND_REQUEST' | 'ESCROW_LOCK' | 'FUNDRAISER_DONATION';
  amount: number;
  currency: string;
  provider: MfsProvider;
  status: PaymentStatus;
  description?: string | null;
  createdAt: string;
}

export interface Escrow {
  id: string;
  marketplaceItemId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title?: string | null;
  body: string;
  data?: Record<string, unknown> | null;
  actorId?: string | null;
  postId?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  actor?: UserProfile | null;
}

export interface TrendingItem {
  hashtag: Hashtag;
  postVolume24h: number;
  activityScore: number;
}

export interface District {
  id: number;
  nameBn: string;
  nameEn: string;
  division: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface SubDistrict {
  id: number;
  districtId: number;
  nameBn: string;
  nameEn: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  likeAlertRate: import('./enums').AlertRate;
  commentAlertRate: import('./enums').AlertRate;
  followAlertRate: import('./enums').AlertRate;
  messageAlertRate: import('./enums').AlertRate;
  mentionAlertRate: import('./enums').AlertRate;
  allowTagging: boolean;
  allowMessaging: import('./enums').MessagePermission;
  showActivityStatus: boolean;
  showReadReceipts: boolean;
  allowContactSync: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreference {
  id: string;
  userId: string;
  topicCategories: string[];
  mutedUsers: string[];
  closeFriends: string[];
  createdAt: string;
  updatedAt: string;
}
