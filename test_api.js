const https = require('https');

function request(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const dataString = data ? JSON.stringify(data) : '';
    const options = {
      hostname: 'open-api.delcom.org',
      port: 443,
      path: '/api/v1' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    };
    if (data) {
      options.headers['Content-Length'] = dataString.length;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', reject);
    if (data) req.write(dataString);
    req.end();
  });
}

async function test() {
  const ts = Date.now();
  const registerRes = await request('POST', '/auth/register', { name: 'test' + ts, email: 'test' + ts + '@test.com', password: 'password123' });
  console.log('Register:', registerRes);
  const loginRes = await request('POST', '/auth/login', { email: 'test' + ts + '@test.com', password: 'password123' });
  console.log('Login:', loginRes);
  
  if (loginRes.data && loginRes.data.token) {
    const usersRes = await request('GET', '/users', null, loginRes.data.token);
    console.log('Users structure:', JSON.stringify(usersRes).substring(0, 500));
    const profileRes = await request('GET', '/users/me', null, loginRes.data.token);
    console.log('Profile structure:', JSON.stringify(profileRes).substring(0, 500));
  }
}

test();
