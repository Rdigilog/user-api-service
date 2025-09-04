import axios from 'axios';

export async function getCountryFromIp(ipAddress: string): Promise<any> {
  const url = `https://ipapi.co/${ipAddress}/json/`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Something went wrong while fetching IP data:`, error);
    throw error;
  }
}
