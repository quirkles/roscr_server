const user = 'default-user';
const pass = 'change-this-password';

export const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://127.0.0.1:27017/myapp';
// export const opts = {
//   user,
//   pass
// };
