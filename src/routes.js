import { Chat as ChatIcon, PaintBrush, Settings as SettingsIcon } from '@vicons/carbon'

import Chat from './views/Chat.vue'
import Draw from './views/Draw.vue'
import Settings from './views/Settings.vue'

export const routes = [{
  path: '/',
  name: 'Chat',
  icon: ChatIcon,
  component: Chat
}, {
  path: '/draw',
  name: 'Draw',
  icon: PaintBrush,
  component: Draw
}, {
  path: '/settings',
  name: 'Settings',
  icon: SettingsIcon,
  component: Settings
}]