import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar } from '@capacitor/status-bar';

export const useNativeFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [appState, setAppState] = useState<'active' | 'background'>('active');

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());

    if (Capacitor.isNativePlatform()) {
      // Listen for app state changes
      App.addListener('appStateChange', ({ isActive }) => {
        setAppState(isActive ? 'active' : 'background');
      });

      // Handle back button on Android
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        App.removeAllListeners();
      }
    };
  }, []);

  const triggerHaptic = async (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!isNative) return;
    
    try {
      const impactStyle = style === 'light' ? ImpactStyle.Light :
                         style === 'heavy' ? ImpactStyle.Heavy : ImpactStyle.Medium;
      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  };

  const setStatusBarStyle = async (style: 'light' | 'dark') => {
    if (!isNative) return;
    
    try {
      await StatusBar.setStyle({ 
        style: style === 'light' ? 'LIGHT' : 'DARK' 
      });
    } catch (error) {
      console.warn('Status bar update failed:', error);
    }
  };

  const exitApp = async () => {
    if (!isNative) return;
    
    try {
      await App.exitApp();
    } catch (error) {
      console.warn('App exit failed:', error);
    }
  };

  return {
    isNative,
    appState,
    triggerHaptic,
    setStatusBarStyle,
    exitApp,
    platform: Capacitor.getPlatform()
  };
};