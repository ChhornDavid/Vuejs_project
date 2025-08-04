import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export const echo = new Echo({
    broadcaster: 'pusher',
    key: 'local',
    wsHost: 'http://172.19.202.96:6001',
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    self: true
});