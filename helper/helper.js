export default function reduce(desc) {
  var sdp = desc.sdp;
  if (sdp !== undefined) {
    var lines = sdp.split('\r\n');
    lines = lines.filter(function (line) {
      return (
        (line.indexOf('a=candidate:') === 0 &&
          line.indexOf('typ relay') !== -1 &&
          line.charAt(14) === '1') ||
        line.indexOf('a=ice-ufrag:') === 0 ||
        line.indexOf('a=ice-pwd:') === 0 ||
        line.indexOf('a=fingerprint:') === 0
      );
    });
    lines = lines.sort().reverse();
    // why is chrome reporting more than one candidate?
    // pick last candidate
    //lines = lines.slice(0, 3).concat(lines[4]);
    var firstcand = true;
    var comp = lines.map(function (line) {
      switch (line.split(':')[0]) {
        case 'a=fingerprint':
          var hex = line
            .substr(22)
            .split(':')
            .map(function (h) {
              return parseInt(h, 16);
            });
          // b64 is slightly more concise than colon-hex
          return btoa(String.fromCharCode.apply(String, hex));
        case 'a=ice-pwd':
          return line.substr(10); // already b64
        case 'a=ice-ufrag':
          return line.substr(12); // already b64
        case 'a=candidate':
          var parts = line.substr(12).split(' ');
          var ip = parts[4].split('.').reduce(function (prev, cur) {
            return (prev << 8) + parseInt(cur, 10);
          });
          // take ip/port from candidate, encode
          // foundation and priority are not required
          // can I have sprintf("%4c%4c%4c%2c") please? pike rocks
          // since chrome (for whatever reason) generates two candidates with the same foundation, ip and different port
          // (possibly the reason for this is multiple local interfaces but still...)
          if (firstcand) {
            firstcand = false;
            return [ip, parseInt(parts[5])]
              .map(function (a) {
                return a.toString(32);
              })
              .join(',');
          } else {
            return [parseInt(parts[5])]
              .map(function (a) {
                return a.toString(32);
              })
              .join(',');
          }
      }
    });
    return [desc.type === 'offer' ? 'O' : 'A'].concat(comp).join(',');
  }
}
