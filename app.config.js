const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return 'com.hgloow.TransportTracker.dev';
    }

    if (IS_PREVIEW) {
        return 'com.hgloow.TransportTracker.preview';
    }

    return 'com.hgloow.TransportTracker';
};

const getAppName = () => {
    if (IS_DEV) {
        return 'TransportTracker (Dev)';
    }

    if (IS_PREVIEW) {
        return 'TransportTracker (Preview)';
    }

    return 'TransportTracker';
};

export default {
    expo: {
        name: getAppName(),
        slug: "TransportTracker",
        version: "1.1.0",
        icon: "./assets/images/icon.png",
        ios: {
            bundleIdentifier: getUniqueIdentifier(),
        },
        android: {
            package: getUniqueIdentifier(),
            usesCleartextTraffic: true,
        },
        updates: {
            url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID}`
        },
        runtimeVersion: {
            policy: "appVersion"
        },
        extra: {
            eas: {
                projectId: process.env.EAS_PROJECT_ID
            }
        },
        plugins: [
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/splash-icon.png",
                    "imageWidth": 200,
                    "resizeMode": "contain",
                    "backgroundColor": "#ffffff"
                }
            ],
            [
                "expo-build-properties",
                {
                    android: {
                        usesCleartextTraffic: true
                    }
                }
            ],
        ]
    },
};
