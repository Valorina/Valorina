import axios, { AxiosResponse, AxiosInstance, AxiosRequestHeaders } from 'axios';
import https from 'https';
import queryString from 'query-string';
import { URL } from 'url';
import { riotClientPlatform, riotClientVersion } from '../config';
import { LoginResponse } from '../types';

const authorize = async (
    username: string,
    password: string,
): Promise<{ headers: AxiosRequestHeaders; userId: string }> => {
    const client: AxiosInstance = axios.create();
    const res: AxiosResponse = await client.post<{ headers: { 'set-cookie': string } }>(
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
                'User-Agent': 'RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)',
            },
            httpsAgent: new https.Agent({
                ciphers: 'TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384',
            }),
        },
    );
    const cookies = res.headers['set-cookie']?.join('; ');
    const {
        data: {
            response: {
                parameters: { uri },
            },
        },
    } = await client.put<LoginResponse>(
        'https://auth.riotgames.com/api/v1/authorization',
        {
            type: 'auth',
            username,
            password,
        },
        {
            withCredentials: true,
            headers: {
                Cookie: cookies as string,
                'User-Agent': 'RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)',
            },
            httpsAgent: new https.Agent({
                ciphers: 'TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384',
            }),
        },
    );

    const parsedUrl = new URL(uri);
    const hash = parsedUrl.hash.replace('#', '');
    const { access_token: accessToken } = queryString.parse(hash);

    const {
        data: { entitlements_token: entitlementsToken },
    } = await client.post<{ entitlements_token: string }>(
        'https://entitlements.auth.riotgames.com/api/token/v1',
        {},
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${accessToken as string}`,
                'User-Agent': 'RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)',
            },
            httpsAgent: new https.Agent({
                ciphers: 'TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384',
            }),
        },
    );

    const {
        data: { sub: userId },
    } = await axios.post<{ sub: string }>(
        'https://auth.riotgames.com/userinfo',
        {},
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${accessToken as string}`,
            },
        },
    );

    const headers: AxiosRequestHeaders = {
        Authorization: `Bearer ${accessToken as string}`,
        'X-Riot-Entitlements-JWT': entitlementsToken,
        'X-Riot-ClientPlatform': riotClientPlatform,
        'X-Riot-ClientVersion': riotClientVersion,
    };
    return { headers, userId };
};

export default authorize;
