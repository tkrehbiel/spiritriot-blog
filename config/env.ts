// This makes environment variable access a little safer and easier.

type EnvVar = {
    name: string;
    defaultValue: string | undefined;
};

type EnvVars = {
    [key: string]: EnvVar;
};

// enum for environment variables we can retrieve
// this is mainly so we can use intellisense
export enum ENV {
    MASTODON_TOKEN,
    COMMENTBOX_APPID,
    METADATA_TABLE,
    SEARCH_TABLE,
    JSON_BUCKET,
    EVENT_QUEUE,
    CONCURRENCY,
    DATA_LOCATION,
}

const definedVariables: EnvVars = {
    [ENV.COMMENTBOX_APPID]: {
        name: 'NEXT_PUBLIC_COMMENTBOX_APPID',
        defaultValue: '',
    },
    [ENV.MASTODON_TOKEN]: {
        name: 'EGV_USER_MASTODON_API_TOKEN',
        defaultValue: '',
    },
    [ENV.METADATA_TABLE]: {
        name: 'EGV_RESOURCE_STATE_TABLE',
        defaultValue: '',
    },
    [ENV.SEARCH_TABLE]: {
        name: 'EGV_RESOURCE_SEARCH_TABLE',
        defaultValue: '',
    },
    [ENV.JSON_BUCKET]: {
        name: 'EGV_RESOURCE_JSON_BUCKET',
        defaultValue: undefined,
    },
    [ENV.EVENT_QUEUE]: {
        name: 'EGV_RESOURCE_EVENT_QUEUE',
        defaultValue: undefined,
    },
    [ENV.CONCURRENCY]: {
        name: 'EGV_USER_FILE_CONCURRENCY',
        defaultValue: '100',
    },
    [ENV.DATA_LOCATION]: {
        name: 'EGV_USER_DATA_LOCATION',
        defaultValue: 'file://data',
    },
};

// Get environment variables in a safer way.
// Throws an error if a variable doesn't exist and there's no default.
// Do not call this from client-side components.
// Use process.env.NEXT_PUBLIC_* instead.
export function getEnv(name: ENV): string {
    const config = definedVariables[name];
    const value = process.env[config.name];
    if (value) return value;

    if (config.defaultValue === undefined) {
        const message = `no value found for variable ${config.name}`;
        console.log(message);
        throw new Error(message); // kill the app
    }

    return config.defaultValue;
}
