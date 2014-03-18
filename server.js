var zWeb         = require('zag');
var daemon = require('zag-daemon');
var PostgresBackend = require('zag-backend-pg');

var db = "postgres://postgres:1234@localhost/postgres";
var daemonHosts = "127.0.0.1:8876";
var daemons = [daemonHosts];
var webHost = "0.0.0.0:8080"

daemon(
  { host:   daemonHosts
  , join:  daemons
  , db:     db
  , env:    "prod"
  , backend: require('zag-backend-pg')
  }
).on("error", function(err) {
  console.error('daemon error', err);
});

zWeb(
  { host:    webHost
  , db:      db
  , env:     "prod"
  , daemons: daemons
  , backend: PostgresBackend
  // This directory needs to be readable and writable by the process.
  , public:  "/tmp/metrics-standalone-public"
  }).on("error", function(err) {
    console.error('web error', err);
  }).on("ready", function() {
    console.log("zag-web listening on " + webHost)
    console.log("zag-daemon pool: " + JSON.stringify(daemons))
  });
