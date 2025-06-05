declare module 'jquery'
declare module 'typeahead.js/dist/bloodhound.js'
import { Router } from 'vue-router'

declare module 'vue-switches' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    useMeta: (item: { [key: string]: any }) => void
    $router: Router
  }
}

declare module 'typeahead.js' {
  const Bloodhound: any
  export = Bloodhound

  var typeahead: any
  export = typeahead
}

declare module 'typeahead.js/dist/bloodhound.js' {
  const Bloodhound: any
  export default Bloodhound
}

declare module 'vue-switches' {
  import switches from 'vue-switches/src/switches.vue'
  export default switches
}

declare module 'jquery' {
  interface JQuery {
    typeahead: any
  }
}

declare global {
  interface JQueryStatic {
    NotificationApp: any
  }
}