import mongoose from 'mongoose';
import {uri} from '../../src/config/mongodb';

import {generate_random_user} from '../../src/utils/user';

const db = mongoose.connect(uri);



