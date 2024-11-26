import Echo from 'laravel-echo';

import Pusher from 'pusher-js/react-native';

import {REVERB_APP_ID, REVERB_HOST, REVERB_PORT, REVERB_SCHEME} from '@/constants/config';
import api  from 'axios';

window.Pusher = Pusher;

const echo = new Echo({
     broadcaster: 'reverb',
     key: REVERB_APP_KEY,
     authorizer: (channel) => {
          return {
              authorize: (socketId, callback) => {
                  api.post('broadcasting/auth', {
                      socket_id: socketId,
                      channel_name: channel.name
                  })
                  .then(response => {
                      callback(false, response.data);
                  })
                  .catch(error => {
                      callback(true, error);
                  });
              }
          };
      },
     wsHost: REVERB_HOST,
     wsPort: REVERB_PORT,
     wssPort: REVERB_PORT,
     forceTLS: (REVERB_SCHEME ?? "https") === "https",
     enabledTransports: ['ws', 'wss'],
});

export default echo;