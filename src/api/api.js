const AUTHORIZATION = 'Basic k29889aeo0w590i';
const BASE_URL = 'https://22.objects.htmlacademy.pro/big-trip';

const createHeaders = () => ({
  'Authorization': AUTHORIZATION,
  'Content-Type': 'application/json'
});

const handleResponse = (response) => {
  if (!response.ok) {
    throw new Error(`Статус ошибки: ${response.status}`);
  }
  return response.json();
};

export default class Api {
  async getPoints() {
    const response = await fetch(`${BASE_URL}/points`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  }

  async getDestinations() {
    const response = await fetch(`${BASE_URL}/destinations`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  }

  async getOffers() {
    const response = await fetch(`${BASE_URL}/offers`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  }

  async updatePoint(pointId, data) {
    const response = await fetch(`${BASE_URL}/points/${pointId}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }
}
