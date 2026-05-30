export interface WsMessage<T = unknown> {
  event: string;
  data: T;
  timestamp: number;
  id?: string;
}

export enum WsEvent {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  HEARTBEAT = 'heartbeat',
  AUTH = 'auth',

  // Presence
  PRESENCE_UPDATE = 'presence:update',
  PRESENCE_BROADCAST = 'presence:broadcast',
  TYPING_START = 'typing:start',
  TYPING_STOP = 'typing:stop',

  // Chat
  MESSAGE_SEND = 'message:send',
  MESSAGE_RECEIVED = 'message:received',
  MESSAGE_READ = 'message:read',
  MESSAGE_DELIVERED = 'message:delivered',
  MESSAGE_DELETE = 'message:delete',

  // Feed
  POST_CREATED = 'post:created',
  POST_DELETED = 'post:deleted',
  POST_REACTED = 'post:reacted',
  POST_SHARED = 'post:shared',

  // Notifications
  NOTIFICATION = 'notification',
  NOTIFICATION_READ = 'notification:read',

  // Stories
  STORY_CREATED = 'story:created',
  STORY_VIEWED = 'story:viewed',
  STORY_EXPIRED = 'story:expired',

  // Calls
  CALL_OFFER = 'call:offer',
  CALL_ANSWER = 'call:answer',
  CALL_ICE_CANDIDATE = 'call:ice-candidate',
  CALL_END = 'call:end',

  // Payments
  PAYMENT_STATUS = 'payment:status',
  ESCROW_UPDATE = 'escrow:update',
}

export interface PresencePayload {
  userId: string;
  status: 'online' | 'busy' | 'offline';
  lastSeenAt?: string;
}

export interface TypingPayload {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface ChatMessagePayload {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string;
  type: string;
  createdAt: string;
}

export interface CallSignalPayload {
  conversationId: string;
  callerId: string;
  calleeId: string;
  sdp?: string;
  candidate?: RTCIceCandidateInit;
}
