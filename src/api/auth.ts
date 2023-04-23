import axios, { AxiosResponse, AxiosInstance, AxiosRequestHeaders } from 'axios';
import https from 'https';
import queryString from 'query-string';
import { URL } from 'url';
import { compress } from 'lzutf8';
import { riotClientPlatform, riotClientVersion } from '../config';
import { LoginFailureResponse, LoginSuccessResponse } from '../types';
import { getCookie } from './databaseCalls';

export const userLogin = async (username: string, password: string): Promise<LoginSuccessResponse> => {
    const {
        headers: { 'set-cookie': setCookie },
    }: AxiosResponse = await axios.post<{ headers: { 'set-cookie': string } }>(
        'https://auth.riotgames.com/api/v1/authorization',
        {
            client_id: 'play-valorant-web-prod',
            nonce: '1',
            redirect_uri: 'https://playvalorant.com/opt_in',
            response_type: 'token id_token',
            scope: 'account openid',
        },
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*',
                'User-Agent': 'RiotClient/51.0.0.4429735.4381201 rso-auth (Windows;10;;Professional, x64)',
            },
            httpsAgent: new https.Agent({
                ciphers: 'TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384',
            }),
        },
    );
    let cookies = <string>setCookie?.join('; ');
    const { data, headers } = await axios.put<LoginSuccessResponse | LoginFailureResponse>(
        'https://auth.riotgames.com/api/v1/authorization',
        {
            type: 'auth',
            username,
            password,
            Remember: 'True',
        },
        {
            withCredentials: true,
            headers: {
                Cookie: cookies,
                'User-Agent': 'RiotClient/51.0.0.4429735.4381201 rso-auth (Windows;10;;Professional, x64)',
            },
            httpsAgent: new https.Agent({
                ciphers: 'TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384',
            }),
        },
    );
    cookies = <string>headers['set-cookie']?.join('; ');
    if (data.error !== undefined) {
        if (data.error === 'auth_failure')
            throw new Error("Your login credentials don't match an account in our system");
        throw new Error('Error has occurred during login');
    }
    data.cookies = cookies;
    return data;
};

const authorize = async (discordId: string, username: string) => {
    // const { type, cookies, response } = await userLogin(username, password);

    const cookie = await getCookie(discordId, username);
    if (cookie.expiryAt < Date.now()) throw new Error('Your cookie has expired');
    const { data, headers } = await axios.get<LoginSuccessResponse>(
        'https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&scope=account%20openid&nonce=1',
        {
            headers: {
                Cookie: cookie.cookie,
            },
        },
    );
    const parsedUrl = new URL(data.response.parameters.uri);
    const hash = parsedUrl.hash.replace('#', '');
    const something = queryString.parse(hash);
    const { access_token: accessToken, id_token: idToken } = something;
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

    // const headers: AxiosRequestHeaders = {
    //     Authorization: `Bearer ${accessToken as string}`,
    //     'X-Riot-Entitlements-JWT': entitlementsToken,
    //     'X-Riot-ClientPlatform': riotClientPlatform,
    //     'X-Riot-ClientVersion': riotClientVersion,
    // };
    // return { type, headers, userId };
};

export default authorize;

export const getEntitlementsToken = async (data: LoginSuccessResponse) => {
    if (data.type === 'multifactor') return { type: data.type };
    const parsedUrl = new URL(data.response.parameters.uri);
    const hash = parsedUrl.hash.replace('#', '');
    const { access_token: accessToken } = queryString.parse(hash);

    const {
        data: { entitlements_token: entitlementsToken },
    } = await axios.post<{ entitlements_token: string }>(
        'https://entitlements.auth.riotgames.com/api/token/v1',
        {},
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${<string>accessToken}`,
                'User-Agent': 'RiotClient/51.0.0.4429735.4381201 rso-auth (Windows;10;;Professional, x64)',
            },
            httpsAgent: new https.Agent({
                ciphers: 'TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384',
            }),
        },
    );
    return entitlementsToken;
};

export const send2fa = async (code: string, cookies: string) => {
    const { headers, data } = await axios.put<LoginSuccessResponse | LoginFailureResponse>(
        'https://auth.riotgames.com/api/v1/authorization',
        {
            type: 'multifactor',
            code,
            rememberDevice: true,
        },
        {
            withCredentials: true,
            headers: {
                Cookie: cookies,
                'User-Agent': 'RiotClient/51.0.0.4429735.4381201 rso-auth (Windows;10;;Professional, x64)',
            },
            httpsAgent: new https.Agent({
                ciphers: 'TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384',
            }),
        },
    );

    return data;
};
