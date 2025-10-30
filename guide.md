# Mini App Context

When your app is opened it can access information about the session from `sdk.context`. This object provides basic information about the user, the client, and where your app was opened from `sdk.actions.MiniAppContext`

It looks like this:

```ts
export type MiniAppPlatformType = 'web' | 'mobile';
 
export type MiniAppContext = {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  location?: MiniAppLocationContext;
  client: {
    platformType?: MiniAppPlatformType;
    clientFid: number;
    added: boolean;
    safeAreaInsets?: SafeAreaInsets;
    notificationDetails?: MiniAppNotificationDetails;
  };
  features?: {
    haptics: boolean;
    cameraAndMicrophoneAccess?: boolean;
  };
};
```

## Implement context 

### Display a user's Farcaster profile information

Below we detect if we are in a mini app, if so, we return the users username, fid, display name, and profile image.

```tsx
// import context
"use client";
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isInMiniApp, setIsInMiniApp] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if we're in a Mini App
        const miniAppStatus = await sdk.isInMiniApp();
        setIsInMiniApp(miniAppStatus);

        if (miniAppStatus) {
          // Get context and extract user info
          const context = await sdk.context;
          setUser(context.user);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  // Show message if not in Mini App
  if (!isInMiniApp) {
    return (
      <div>
        <p>Please open this app in a Farcaster or Base client to see your profile.</p>
      </div>
    );
  }

  // Show user information
  if (user) {
    return (
      <div>
        <h2>Welcome, {user.displayName || user.username}!</h2>
        <p>FID: {user.fid}</p>
        <p>Username: @{user.username}</p>
        {user.pfpUrl && (
          <img 
            src={user.pfpUrl} 
            alt="Profile" 
            width={64} 
            height={64} 
            style={{ borderRadius: '50%' }}
          />
        )}
      </div>
    );
  }

  return <div>Loading user profile...</div>;
}
```

### Key Points:

1. **Always check `isInMiniApp()`** before accessing context data
2. **User data includes**: `fid`, `username`, `displayName`, and `pfpUrl`
3. **Handle the non-Mini App case** by showing appropriate messaging
4. **Profile images** are optional - always check if `pfpUrl` exists before rendering

This is the simplest way to get started with Farcaster user context in your Mini App!
