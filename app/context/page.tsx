"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

export default function Context() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [context, setContext] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMiniApp, setIsMiniApp] = useState<boolean>(false);

    useEffect(() => {
        const loadContext = async () => {
            try {
                // Check if running in a Mini App
                const miniAppStatus = await sdk.isInMiniApp();
                console.log('Is Mini App:', miniAppStatus);
                setIsMiniApp(miniAppStatus);

                if (miniAppStatus) {
                    // Only load context if in Mini App
                    const contextData = await sdk.context;
                    console.log('Full context:', contextData);
                    setContext(contextData);
                } else {
                    console.log('Not in Mini App - context not available');
                }
                
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
        return (
            <div style={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="text-center">
                    <div className="mb-4 text-2xl">⏳</div>
                    <p>Loading context...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="text-center text-red-400">
                    <div className="mb-4 text-2xl">❌</div>
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    // Show message if not in Mini App
    if (!isMiniApp) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                color: 'white',
                position: 'relative'
            }}>
                {/* Back button */}
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem'
                }}>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            background: '#f7d954',
                            color: '#000',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.background = '#f5d73a';
                            target.style.transform = 'translateY(-2px)';
                            target.style.boxShadow = '0 4px 15px rgba(247, 217, 84, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.background = '#f7d954';
                            target.style.transform = 'translateY(0)';
                            target.style.boxShadow = 'none';
                        }}
                    >
                        ← Back
                    </button>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '3rem 2rem',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        maxWidth: '600px'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📱</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            Not in Mini App
                        </h1>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e0e0e0', marginBottom: '2rem' }}>
                            Farcaster context is only available when running inside a Mini App. 
                            Please open this app in one of the following:
                        </p>
                        
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '1rem',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                background: 'rgba(139, 69, 255, 0.2)',
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(139, 69, 255, 0.3)',
                                width: '100%'
                            }}>
                                <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>🟣 Farcaster App</h3>
                                <p style={{ fontSize: '0.9rem', color: '#c0c0c0' }}>
                                    Official Farcaster mobile app with Mini App support
                                </p>
                            </div>
                            
                            <div style={{
                                background: 'rgba(0, 82, 255, 0.2)',
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(0, 82, 255, 0.3)',
                                width: '100%'
                            }}>
                                <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>🔵 Base App</h3>
                                <p style={{ fontSize: '0.9rem', color: '#c0c0c0' }}>
                                    Base ecosystem app with Mini App integration
                                </p>
                            </div>
                        </div>

                        <p style={{ 
                            fontSize: '0.9rem', 
                            color: '#a0a0a0', 
                            marginTop: '2rem',
                            fontStyle: 'italic'
                        }}>
                            Context data includes user info, launch location, client details, and available features.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const renderLocationContext = () => {
        if (!context?.location) {
                        return <p className="text-gray-400">No location context available</p>;
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
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            color: 'white',
            position: 'relative'
        }}>
            {/* Back button */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem'
            }}>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        background: '#f7d954',
                        color: '#000',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.background = '#f5d73a';
                        target.style.transform = 'translateY(-2px)';
                        target.style.boxShadow = '0 4px 15px rgba(247, 217, 84, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.background = '#f7d954';
                        target.style.transform = 'translateY(0)';
                        target.style.boxShadow = 'none';
                    }}
                >
                    ← Back
                </button>
            </div>
            
            <div className="max-w-4xl mx-auto p-6 space-y-8" style={{ paddingTop: '4rem' }}>
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Farcaster Context</h1>
                    <p className="text-gray-300">Complete session context information</p>
                </div>

                {/* User Information */}
                <section style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '16px', 
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <h2 className="text-xl font-semibold mb-4">User Information</h2>
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
                        <p className="text-gray-400">No user information available</p>
                    )}
                </section>

                {/* Location Context */}
                <section style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '16px', 
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <h2 className="text-xl font-semibold mb-4">Location Context</h2>
                    {renderLocationContext()}
                </section>

                {/* Client Information */}
                <section style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '16px', 
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <h2 className="text-xl font-semibold mb-4">Client Information</h2>
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
                        <p className="text-gray-400">No client information available</p>
                    )}
                </section>

                {/* Features */}
                <section style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '16px', 
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <h2 className="text-xl font-semibold mb-4">Available Features</h2>
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
                        <p className="text-gray-400">No feature information available</p>
                    )}
                </section>

                {/* Raw Context Data */}
                <section style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '16px', 
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <h2 className="text-xl font-semibold mb-4">Raw Context Data</h2>
                    <pre style={{ 
                        background: 'rgba(0, 0, 0, 0.3)', 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        fontSize: '0.75rem', 
                        overflow: 'auto', 
                        maxHeight: '24rem',
                        color: '#f0f0f0'
                    }}>
                        {JSON.stringify(context, null, 2)}
                    </pre>
                </section>
            </div>
        </div>
    );
}