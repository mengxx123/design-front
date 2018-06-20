import page from './page'
import handler from './handler'
import quickPopover from './quick-popover'

export default {
    install: function (Vue) {
        Vue.component('my-page', page)
        Vue.component('handler', handler)
        Vue.component('quick-popover', quickPopover)
    }
}
