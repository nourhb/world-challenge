export const RATE_LIMITS = {
  loginFailedPerMinutePerIp: 5,
  registerPerHourPerIp: 5,
  messagesPerMinutePerUser: 30,
  answersPerQuestionPerPlayer: 1,
  reportsPerHourPerUser: 10,
} as const;
