'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function PrivyProviders({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider 
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
            loginMethods: ['email', 'google'],
            embeddedWallets: {
                createOnLogin: 'off',
            },
    }}>
        {children}
    </PrivyProvider>
    );
}