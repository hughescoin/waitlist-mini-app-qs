"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

export default function Context() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [context, setContext] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadContext = async () => {
            try {
                const contextData = await sdk.context;
                console.log('Full context:', contextData);
                setContext(contextData);
                setIsLoading(false);
            } catch (err) {
                console.error('Error accessing context:', err);
                setError('Failed to load context data');
                setIsLoading(false);
            }
        };
        
        loadContext();
    }, []);

    if (isLoading) {
        return <div className="p-4">Loading context...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error: {error}</div>;
    }

    const renderLocationContext = () => {
        if (!context?.location) {
            return <p className="text-gray-500">No location context available</p>;
        }

        const { location } = context;
        
        switch (location.type) {
            case 'cast_embed':
                return (
                    <div className="bg-blue-50 p-3 rounded">
                        <h4 className="font-semibold text-blue-800">Cast Embed Context</h4>
                        <p><strong>Embed URL:</strong> {location.embed}</p>
                        <div className="mt-2">
                            <strong>Cast Details:</strong>
                            <ul className="ml-4 mt-1">
                                <li>Author: {location.cast.author.displayName} (@{location.cast.author.username})</li>
                                <li>FID: {location.cast.author.fid}</li>
                                <li>Text: &ldquo;{location.cast.text}&rdquo;</li>
                                <li>Hash: {location.cast.hash}</li>
                                {location.cast.channelKey && <li>Channel: {location.cast.channelKey}</li>}
                            </ul>
                        </div>
                    </div>
                );
            
            case 'cast_share':
                return (
                    <div className="bg-green-50 p-3 rounded">
                        <h4 className="font-semibold text-green-800">Cast Share Context</h4>
                        <div>
                            <strong>Shared Cast:</strong>
                            <ul className="ml-4 mt-1">
                                <li>Author: {location.cast.author.displayName} (@{location.cast.author.username})</li>
                                <li>Text: &ldquo;{location.cast.text}&rdquo;</li>
                                <li>Hash: {location.cast.hash}</li>
                            </ul>
                        </div>
                    </div>
                );
            
            case 'notification':
                return (
                    <div className="bg-yellow-50 p-3 rounded">
                        <h4 className="font-semibold text-yellow-800">Notification Context</h4>
                        <ul className="ml-4">
                            <li><strong>Title:</strong> {location.notification.title}</li>
                            <li><strong>Body:</strong> {location.notification.body}</li>
                            <li><strong>ID:</strong> {location.notification.notificationId}</li>
                        </ul>
                    </div>
                );
            
            case 'launcher':
                return (
                    <div className="bg-purple-50 p-3 rounded">
                        <h4 className="font-semibold text-purple-800">Launcher Context</h4>
                        <p>App launched directly from client</p>
                    </div>
                );
            
            case 'channel':
                return (
                    <div className="bg-indigo-50 p-3 rounded">
                        <h4 className="font-semibold text-indigo-800">Channel Context</h4>
                        <ul className="ml-4">
                            <li><strong>Channel:</strong> {location.channel.name}</li>
                            <li><strong>Key:</strong> {location.channel.key}</li>
                            {location.channel.imageUrl && <li><strong>Image:</strong> {location.channel.imageUrl}</li>}
                        </ul>
                    </div>
                );
            
            case 'open_miniapp':
                return (
                    <div className="bg-teal-50 p-3 rounded">
                        <h4 className="font-semibold text-teal-800">Mini App Referral</h4>
                        <p><strong>Referrer Domain:</strong> {location.referrerDomain}</p>
                    </div>
                );
            
            default:
                return (
                    <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-semibold">Unknown Location Context</h4>
                        <pre className="text-xs mt-2 overflow-auto">
                            {JSON.stringify(location, null, 2)}
                        </pre>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Farcaster Context</h1>
                <p className="text-gray-600">Complete session context information</p>
            </div>

            {/* User Information */}
            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">User Information</h2>
                {context?.user ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>FID:</strong> {context.user.fid}
                        </div>
                        <div>
                            <strong>Username:</strong> {context.user.username || 'N/A'}
                        </div>
                        <div>
                            <strong>Display Name:</strong> {context.user.displayName || 'N/A'}
                        </div>
                        <div className="md:col-span-2">
                            <strong>Profile Image:</strong>
                            {context.user.pfpUrl ? (
                                <div className="mt-2">
                                    <img 
                                        src={context.user.pfpUrl} 
                                        alt="Profile" 
                                        className="w-16 h-16 rounded-full"
                                    />
                                </div>
                            ) : ' N/A'}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">No user information available</p>
                )}
            </section>

            {/* Location Context */}
            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Location Context</h2>
                {renderLocationContext()}
            </section>

            {/* Client Information */}
            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Client Information</h2>
                {context?.client ? (
                    <div className="space-y-3">
                        <div>
                            <strong>Platform:</strong> {context.client.platformType || 'Unknown'}
                        </div>
                        <div>
                            <strong>Client FID:</strong> {context.client.clientFid}
                        </div>
                        <div>
                            <strong>App Added:</strong> {context.client.added ? 'Yes' : 'No'}
                        </div>
                        
                        {context.client.safeAreaInsets && (
                            <div>
                                <strong>Safe Area Insets:</strong>
                                <div className="ml-4 text-sm bg-gray-50 p-2 rounded mt-1">
                                    Top: {context.client.safeAreaInsets.top}px, 
                                    Bottom: {context.client.safeAreaInsets.bottom}px, 
                                    Left: {context.client.safeAreaInsets.left}px, 
                                    Right: {context.client.safeAreaInsets.right}px
                                </div>
                            </div>
                        )}
                        
                        {context.client.notificationDetails && (
                            <div>
                                <strong>Notifications Enabled:</strong>
                                <div className="ml-4 text-sm bg-gray-50 p-2 rounded mt-1">
                                    URL: {context.client.notificationDetails.url}<br/>
                                    Token: {context.client.notificationDetails.token?.substring(0, 10)}...
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500">No client information available</p>
                )}
            </section>

            {/* Features */}
            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Features</h2>
                {context?.features ? (
                    <div className="space-y-2">
                        <div className={`p-2 rounded ${context.features.haptics ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <strong>Haptics:</strong> {context.features.haptics ? 'Available' : 'Not Available'}
                        </div>
                        {context.features.cameraAndMicrophoneAccess !== undefined && (
                            <div className={`p-2 rounded ${context.features.cameraAndMicrophoneAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <strong>Camera & Microphone:</strong> {context.features.cameraAndMicrophoneAccess ? 'Access Granted' : 'Access Not Granted'}
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500">No feature information available</p>
                )}
            </section>

            {/* Raw Context Data */}
            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Raw Context Data</h2>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(context, null, 2)}
                </pre>
            </section>
        </div>
    );
}