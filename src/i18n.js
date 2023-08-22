import { createI18n } from 'vue-i18n'

import { language } from './settings'
import { watch } from 'vue'

const messages = {
  'en-US': {
    input: {
      placeholder: 'Say something...'
    },
    button: {
      send: 'Send'
    },
    ui: {
      title: 'GPT123',
      ui: 'UI',
      language: 'Language',
      enterToSend: 'Enter to send?',
      pressEnterToSend: '[Enter to send]'
    }
  },
  'zh-CN': {
    input: {
      placeholder: '说点啥...'
    },
    button: {
      send: '发送'
    },
    ui: {
      title: '狗屁通123',
      ui: '界面',
      language: '语言',
      enterToSend: '回车发送?',
      pressEnterToSend: '[回车发送]'
    }
  }
}

const i18n = createI18n({
  locale: language.value,
  fallbackLocale: 'en-US',
  messages
})

document.title = i18n.global.t('ui.title')
watch(language, lang => {
  i18n.global.locale = lang
  document.title = i18n.global.t('ui.title')
})

export default i18n