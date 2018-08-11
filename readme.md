# React Native Live Map (Find My Friends clone)

![React Native Find My Friends Screenshot](iphone-screenshot.png =440x)

## Providing the Scaledrone channel properties

Go to Scaledrone dashboard and create a new channel. Select the following options:
* Select _Message history is enabled_
* Select _Always require authentication_

Once you've created the channel go ahead and replace the channel ID and secrets in this bash script and then run it to create three Scaledrone configuration files.

```bash
echo '"CHANNEL_ID_FROM_SCALEDRONE_DASHBOARD"' | tee -a ./server/scaledrone_channel_id.json ./GoogleMapPlayground/scaledrone_channel_id.json

echo '"CHANNEL_SECRET_FROM_SCALEDRONE_DASHBOARD"' | tee ./server/scaledrone_channel_secret.json
```

The script will generate the following files. Each file will contain a simple string key.

```
project_root/
├── GoogleMapPlayground/
│   └── scaledrone_channel_id.json
└── server/
    ├── scaledrone_channel_id.json
    └── scaledrone_channel_secret.json
```
