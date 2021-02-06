export default async function load() {
  await import('./native-device-registry');
  await import('./xml/xml-rpc-server');
  await import('./xml/xml-rpc-client');
  await import('./json/json-rpc-client');
}
