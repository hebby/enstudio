const cusError = require('../config/errors-config')
module.exports = {
    doControler: async (ctx, next, callback) => {
      console.log('ctx.session...', ctx.session);
      if (!ctx.session || !ctx.session.user) {   
        ctx.status = 200;
        ctx.body = cusError.getErrorInfo(1000, '');
        return;
      }
      ctx.body = {session: ctx.session}
      return;
      //await callback(ctx, next);
    },
  }