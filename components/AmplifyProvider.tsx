'use client'

import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import amplifyConfig from '../amplify_outputs.json';

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // クライアントサイドでAmplify設定を確実に読み込み
    try {
      console.log('Configuring Amplify with:', amplifyConfig);
      Amplify.configure(amplifyConfig);
      console.log('Amplify configured successfully');
    } catch (error) {
      console.error('Failed to configure Amplify:', error);
    }
  }, []);

  return <>{children}</>;
}