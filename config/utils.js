var getClientIp = function (req) {
  var ipAddress;
  // Amazon EC2 / Heroku workaround to get real client IP
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // Ensure getting client IP address still works in
    // development environment
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};

var inArray = function (needle, haystack, argStrict) {
  var key = '',
    strict = !! argStrict;

  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }
  return false;
};

function extractKeywords(text) {
  if (!text) return [];
  text=text.replace(",","");
  return text.
    split(/\s+/).
    filter(function(v) { return v.length > 3; }).
    filter(function(v, i, a) { return a.lastIndexOf(v) === i; });
}

exports.getClientIp = getClientIp;
exports.inArray     = inArray;
exports.extractKeywords = extractKeywords;