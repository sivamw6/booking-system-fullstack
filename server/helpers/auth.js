
function isAuthenticated(context) {
	console.log("User object is authenticated: ", context);
	if (!context.user) {
		throw new Error('Not authenticated')
	}
}


function isAuthorized(targetUserId, context) {
  console.log("User object in isAuthorized:", context.user);

  if (!context.user) {
    throw new Error('User is not authenticated', 'UNAUTHENTICATED');
  }
  if (context.user.id === targetUserId) {
    return;
  }
  throw new Error('User is not authorized to perform this action', 'FORBIDDEN');
}



function isAdminAuthorized(context) {
  console.log("User object in isAuthorized:", context.user);
  if (!context.user || !context.user.isAdmin) {
    throw new Error('User is not authorized to perform this action', 'FORBIDDEN');
  }
}


module.exports.isAuthenticated = isAuthenticated;
module.exports.isAuthorized = isAuthorized;
module.exports.isAdminAuthorized = isAdminAuthorized;