import Echo from 'laravel-echo';

import Pusher from 'pusher-js';

import { useState, useEffect } from 'react';

import {REVERB_APP_KEY, REVERB_HOST, REVERB_PORT, REVERB_SCHEME} from '@/constants/config';
import api  from 'axios';


const useEcho = () => {
     const [echoInstance, setEchoInstance] = useState<any>(null);

     useEffect(() => {
          (window as any).Pusher = Pusher;
          const echo = new Echo({
               broadcaster: 'reverb',
               key: REVERB_APP_KEY,
               authorizer: (channel: any) => {
                    return {
                        authorize: ({socketId, callback} : {socketId: any, callback: any}) => {
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
               wsHost: '192.168.1.48',
            //    wsHost: '192.168.84.237',
               wsPort: REVERB_PORT,
               wssPort: REVERB_PORT,
               forceTLS: (REVERB_SCHEME ?? "https") === "https",
               enabledTransports: ['ws', 'wss'],
          });

          setEchoInstance(echo);
     }, [])

     return echoInstance;
}

export default useEcho;