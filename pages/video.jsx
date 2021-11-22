import React from 'react';
import Main from '../components/Video/Desktop/Main';
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';

const Video = ({ ua }) => {
  return (
    <UserAgentProvider ua={ua}>
      <div>
        <UserAgent mobile>
          <p>This will only be rendered on mobile</p>
        </UserAgent>
        <UserAgent computer>
          <Main />
        </UserAgent>
      </div>
    </UserAgentProvider>
  );
};

Video.getInitialProps = async (args) => {
  return {
    ua: args.req ? args.req.headers['user-agent'] : navigator.userAgent
  };
};

export default Video;
