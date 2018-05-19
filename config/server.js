module.exports = {
  'https': false, //If you turn this on, you should add the certs in the 'ssl' attributes
  'ssl': {
    'pfx': 'certs/cert.file.pfx',
    'passphrase': 'certs-password'
  },
  'showLogs': true //Turn this off to not display every message sent to the service
};
