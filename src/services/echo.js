import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export const echo = new Echo({
    broadcaster: 'pusher',
    key: 'local',
    cluster: 'mt1',
    wsHost: '172.19.202.96',
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    self: true,
    enabledTransports: ['ws']
});
//172.19.202.96
// wsHost: window.location.hostname,