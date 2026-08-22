/**
 * Simulates real network latency and occasional failure so that loading /
 * error states can be exercised in the UI even while running on mock data.
 */
export function delay(data, ms = 420) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export function delayFail(message = "Something went wrong.", ms = 420) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(Object.assign(new Error(message), { status: 500 })), ms)
  );
}
