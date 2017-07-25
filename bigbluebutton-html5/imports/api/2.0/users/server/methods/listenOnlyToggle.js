import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RedisPubSub from '/imports/startup/server/redis2x';
import Logger from '/imports/startup/server/logger';
import Meetings from '/imports/api/2.0/meetings';
import Users from '/imports/api/2.0/users';

export default function listenOnlyToggle(credentials, isJoining = true) {
  const REDIS_CONFIG = Meteor.settings.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;

  const { meetingId, requesterUserId } = credentials;

  check(meetingId, String);
  check(requesterUserId, String);
  check(isJoining, Boolean);

  let EVENT_NAME;

  if (isJoining) {
    EVENT_NAME = 'UserConnectedToGlobalAudioMsg';
  } else {
    EVENT_NAME = 'UserDisconnectedFromGlobalAudioMsg';
  }

  const User = Users.findOne({
    userId: requesterUserId,
  });

  const Meeting = Meetings.findOne({ meetingId });

  if (!User) {
    throw new Meteor.Error(
      'user-not-found', 'You need a valid user to be able to toggle audio');
  }

  // check(User.user.name, String);

  const header = {
    name: EVENT_NAME,
    voiceConf: Meeting.voiceProp.voiceConf,
  };

  const payload = {
    userId: requesterUserId,
    name: User.user.name,
  };

  Logger.verbose(`User '${requesterUserId}' ${isJoining
    ? 'joined' : 'left'} global audio from meeting '${meetingId}'`);

  return RedisPubSub.publish(CHANNEL, EVENT_NAME, meetingId, payload, header);
}
