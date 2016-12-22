import mongoose from 'mongoose';
import D from 'date-fp';
import cuid from 'cuid';
import {omit} from 'ramda';

import {rename_keys} from '../utils/object';

const savings_goal_schema = new mongoose.Schema({
  _id: String,
  circle_member_id: String,
  savings_goal: String
});

const payout_event_schema = new mongoose.Schema({
  _id: String,
  date: Date,
  circle_member_id: String
});

const circle_schema = new mongoose.Schema({
  _id: {
    type: String
  },
  name: String,
  created_by: {
    type: String,
    ref: 'User'
  },
  participant_count: Number,
  cycle_period: String,
  start_date: Date,
  members: {
    type: Array
  },
  activity: {
    type: Array,
    default: []
  },
  payoutEvents: [payout_event_schema],
  savingsGoals: [savings_goal_schema],
  created: {
    type: Date,
    default: Date.now
  },
  last_modified: Date
});

circle_schema.pre('save', function (next) {
  this.created = this.created || new Date();
  this.last_modified = new Date();
  if (!this.payout_events.length) {
    const period = this.cyclePeriod === 'monthly' ? 'months' : 'days';
    const multiplier = this.cyclePeriod === 'bi-weekly' ? 14 : this.cyclePeriod === 'weekly' ? 7 : 1;
    for (let i = 0; i < this.participantCount; i++) {
      this.payoutEvents.push({
        date: D.add(period, multiplier * i, this.startDate),
        _id: cuid()
      });
    }
  }
  next();
});

if (!circle_schema.options.toJSON) {
  circle_schema.options.toJSON = {};
}

circle_schema.options.toJSON.transform = (doc, ret) => omit(['_id', 'password'], rename_keys({_id: 'id'}, ret));

const circle_model = mongoose.model('Circle', circle_schema);

export default circle_model;
