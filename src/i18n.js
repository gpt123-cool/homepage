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
    }
  },
  'zh-CN': {
    input: {
      placeholder: '说点啥...'
    },
    button: {
      send: '发送'
    }
  }
}

const i18n = createI18n({
  locale: language.value,
  fallbackLocale: 'en-US',
  messages
})

watch(language, lang => i18n.global.locale = lang)
export default i18n