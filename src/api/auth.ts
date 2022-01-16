import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import queryString from 'query-string';
import { Headers } from '../types';

export const authorize = async (username: string, password: string): Promise<{ headers: Headers; userId: string; }> => {
    const jar: CookieJar = new CookieJar();
    const client: AxiosInstance = wrapper(axios.create({ jar }));
    await client.post(
        'https://auth.riotgames.com/api/v1/authorization',
        {
            client_id: 'play-valorant-web-prod',
            nonce: '1',
            redirect_uri: 'https://playvalorant.com/opt_in',
            response_type: 'token id_token',
        },
        {
            jar: jar,
            withCredentials: true,
        },
    );

    const response: AxiosResponse = await client.put(
        'https://auth.riotgames.com/api/v1/authorization',
        {
            type: 'auth',
            username: username,
            password: password,
        },
        {
            jar: jar,
            withCredentials: true,
        },
    );

    if (response.data.error) {
        throw new Error(response.data.error);
    }

    const parsedUrl = new URL(response.data.response.parameters.uri);
    const hash = parsedUrl.hash!.replace('#', '');
    const { access_token: accessToken } = queryString.parse(hash);

    const { data: { entitlements_token: entitlementsToken } } = await client.post(
        'https://entitlements.auth.riotgames.com/api/token/v1',
        {},
        {
            jar: jar,
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const { data: {sub: userId} } = await axios.post(
        'https://auth.riotgames.com/userinfo',
        {},
        {
            jar: jar,
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const headers: Headers = {
        'Authorization': `Bearer ${accessToken}`,
        'X-Riot-Entitlements-JWT': entitlementsToken,
        'X-Riot-ClientPlatform': 'ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9',
        'X-Riot-ClientVersion': 'pbe-shipping-55-604424'
    }
    return {headers,userId};
};