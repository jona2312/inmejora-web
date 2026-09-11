import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import tls from 'node:tls';
import dns from 'node:dns';
import dnsPromises from 'node:dns/promises';
import dgram from 'node:dgram';
import { syncBuiltinESMExports } from 'node:module';

const deny = () => { throw new Error('CI_OFFLINE: network access is forbidden'); };
globalThis.fetch = deny;
for (const transport of [http, https]) {
  transport.request = deny;
  transport.get = deny;
}
net.connect = deny;
net.createConnection = deny;
net.Socket.prototype.connect = deny;
tls.connect = deny;
dgram.createSocket = deny;
for (const api of [dns, dnsPromises]) {
  for (const key of Object.keys(api)) {
    if (key === 'lookup' || key === 'lookupService' || key === 'reverse' || key.startsWith('resolve')) {
      api[key] = deny;
    }
  }
}
syncBuiltinESMExports();
