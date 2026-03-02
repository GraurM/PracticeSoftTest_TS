import http from 'k6/http';
import { check, sleep } from 'k6';

const ciEnv = String(__ENV.CI ?? '').trim().toLowerCase();
const isCI = ciEnv === 'true' || ciEnv === '1';
const baseUrl = String(__ENV.BASE_URL || 'https://automationteststore.com/').replace(/\/+$/, '');

export const options = {
  vus: 5,
  duration: '20s',
  thresholds: {
    checks: ['rate>0.99'],
    http_req_failed: ['rate<0.01'],
    http_req_duration: isCI
      ? ['p(95)<12000']
      : ['p(95)<1500']
  },
};

export default function () {
  const homeResponse = http.get(`${baseUrl}/`);
  check(homeResponse, {
    'homepage status is 200': (response) => response.status === 200,
  });

  const productResponse = http.get(`${baseUrl}/index.php?rt=product/product&product_id=50`);
  check(productResponse, {
    'product page status is 200': (response) => response.status === 200,
  });

  sleep(1);
}
