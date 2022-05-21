import axios, { AxiosResponse, AxiosInstance, AxiosRequestHeaders } from 'axios';
import https from "https";
import queryString from 'query-string';

export const authorize = async (
    username: string,
    password: string,
): Promise<{ headers: AxiosRequestHeaders; userId: string }> => {
    const client: AxiosInstance = axios.create();
    const res: AxiosResponse = await client.post(
        'https://auth.riotgames.com/api/v1/authorization',
        {
            client_id: 'play-valorant-web-prod',
            nonce: '1',
            redirect_uri: 'https://playvalorant.com/opt_in',
            response_type: 'token id_token',
        },
        {
            withCredentials: true,
            headers: {
                Accept: '*/*',
                'User-Agent': "RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)"
            },
            httpsAgent: new https.Agent({
                ciphers: "TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384",
            }),
        },
    );
    
    const cookies = res.headers["set-cookie"]!.join("; ");

    const response: AxiosResponse = await client.put(
        'https://auth.riotgames.com/api/v1/authorization',
        {
            type: 'auth',
            username: username,
            password: password,
        },
        {
            withCredentials: true,
            headers: {
                "Cookie": cookies,
                'User-Agent': "RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)"
            },
            httpsAgent: new https.Agent({
                ciphers: "TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384",
            }),
        },
    );

    if (response.data.error) {
        throw new Error(response.data.error);
    }


    const parsedUrl = new URL(response.data.response.parameters.uri);
    const hash = parsedUrl.hash!.replace('#', '');
    const { access_token: accessToken } = queryString.parse(hash);

    const {
        data: { entitlements_token: entitlementsToken },
    } = await client.post(
        'https://entitlements.auth.riotgames.com/api/token/v1',
        {
        },
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'User-Agent': "RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)"
            },
            httpsAgent: new https.Agent({
                ciphers: "TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384",
            }),
        },
    );

    const {
        data: { sub: userId },
    } = await axios.post(
        'https://auth.riotgames.com/userinfo',
        {},
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    const headers: AxiosRequestHeaders = {
        Authorization: `Bearer ${accessToken}`,
        'X-Riot-Entitlements-JWT': entitlementsToken,
        'X-Riot-ClientPlatform':
            'ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9',
        'X-Riot-ClientVersion': 'pbe-shipping-55-604424',
    };
    return { headers, userId };
};
