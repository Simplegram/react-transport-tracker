const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
const USERNAME = process.env.USERNAME || 'username'

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return `com.${USERNAME}.TransportTracker.dev`;
    }

    if (IS_PREVIEW) {
        return `com.${USERNAME}.TransportTracker.preview`;
    }

    return `com.${USERNAME}.TransportTracker`;
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
        version: "1.6.0b5",
        icon: "./assets/images/icon.png",
        ios: {
            bundleIdentifier: getUniqueIdentifier(),
        },
        android: {
            package: getUniqueIdentifier(),
            usesCleartextTraffic: true,
            permissions: [
                "android.permission.ACCESS_COARSE_LOCATION", 
                "android.permission.ACCESS_FINE_LOCATION", 
                "android.permission.FOREGROUND_SERVICE"
            ]
        },
        newArchEnabled: false,
        updates: {
            url: 'https://u.expo.dev/e8e4f24c-2007-4cad-a12f-7310de360390'
        },
        runtimeVersion: {
            policy: "appVersion"
        },
        extra: {
            eas: {
                projectId: "e8e4f24c-2007-4cad-a12f-7310de360390"
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
