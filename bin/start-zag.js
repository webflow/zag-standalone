#!/usr/bin/env node
var path         = require('path')
  , zWeb         = require('zag')
  , zDaemon      = require('zag-daemon')
  , PostgresBackend = require('zag-backend-pg')
  , daemonHost   = "127.0.0.1:8876"
  , daemons      = [daemonHost]
  , webHost      = "0.0.0.0:8080"
  , DEFAULT_ENV  = "production"
  , argv         = process.argv
  , args         = argv.slice(2)
  , l            = console.log

if (args.length === 0) usage()

start(args[0], args[1], args[2])

function start(db, env, wh) {
  console.log('Starting zag daemon + web...');
  console.log(db, env);
  env = env || DEFAULT_ENV;
  wh = wh || webHost;

  zDaemon(
  { host:    daemonHost
  , join:    daemons
  , db:      db
  , env:     env
  , backend: PostgresBackend
  }).on("error", onError)

  zWeb(
  { host:    webHost
  , db:      db
  , env:     env
  , daemons: daemons
  , backend: PostgresBackend
  // This directory needs to be readable and writable by the process.
  , public:  "/tmp/metrics-standalone-public"
  }).on("error", onError).on("ready", function() {
    console.log("zag-web listening on " + webHost)
    console.log("zag-daemon pool: " + JSON.stringify(daemons))
  })
}

function onError(err) { console.error(err) }

function usage() {
  l("Usage: " + argv[0] + " " + path.basename(argv[1]) + " <leveldb file> [env]")
  l("")
  l("Start a standalone Zag server and daemon.")
  l("The first time it is run it will create the tables and indices.")
  process.exit(1)
}
