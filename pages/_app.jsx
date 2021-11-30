import { useEffect } from 'react';
// import 'assets/main.css';
// import 'assets/chrome-bug.css';
import '../public/styles/style.css';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { store } from '../redux/store';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <div className="bg-primary">
      {/* <UserContextProvider>
        <Layout> */}
      <Provider store={store}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </Provider>
      {/* </Layout>
      </UserContextProvider> */}
    </div>
  );
}
