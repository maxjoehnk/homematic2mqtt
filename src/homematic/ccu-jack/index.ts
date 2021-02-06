export default async function load() {
  await import('./jack-device-registry');
  await import('./jack-device-api');
  await import('./jack-device-observer');
}
