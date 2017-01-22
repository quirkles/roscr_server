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

const circle_activity_schema = new mongoose.Schema({
  _id: {
    type: String,
    default: cuid()
  },
  date: {
    type: Date,
    default: Date.now
  },
  activity_type: String,
  originator: {
    type: String,
    ref: 'User'
  }
});

const circle_schema = new mongoose.Schema({
  _id: {
    type: String
  },
  circle_name: String,
  created_by: {
    type: String,
    ref: 'User'
  },
  withdrawal_amount: Number,
  contribution_amount: Number,
  participant_count: {
    type: Number,
    default: 12
  },
  cycle_period: {
    type: String,
    default: 'monthly'
  },
  start_date: {
    type: Date,
    default: D.add('days', 14, new Date())
  },
  members: [{
    type: String,
    ref: 'User'
  }],
  is_public: {
    type: Boolean,
    default: false
  },
  activity: [circle_activity_schema],
  payout_events: [payout_event_schema],
  savings_goals: [savings_goal_schema],
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
    const period = this.cycle_period === 'monthly' ? 'months' : 'days';
    const multiplier = this.cycle_period === 'bi-weekly' ? 14 : this.cycle_period === 'weekly' ? 7 : 1;
    for (let i = 0; i < this.participant_count; i++) {
      this.payout_events.push({
        date: D.add(period, multiplier * i, this.start_date),
        _id: cuid()
      });
    }
  }
  next();
});

if (!circle_schema.options.toJSON) {
  circle_schema.options.toJSON = {};
}

circle_schema.options.toJSON.transform = (doc, ret) => omit(['_id'], rename_keys({_id: 'id'}, ret));

const circle_model = mongoose.model('Circle', circle_schema);

export default circle_model;
