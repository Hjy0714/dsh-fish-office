function runScene(scope,resource){
 const {window,document,parent,addEventListener,requestAnimationFrame,cancelAnimationFrame,setTimeout,clearTimeout,setInterval,clearInterval,Worker,MutationObserver,ResizeObserver}=scope;
 Object.assign(window,resource.defaults,{OFFICE_MANAGED:true,PIXEL_ASSETS:resource.art});
 /* @include src/scene/world.js */
 /* @include src/scene/navigation.js */
 /* @include src/global-dialogue.js */
 /* @include src/global-controller.js */
 /* @include src/scene/engine.js */
 /* @include src/bridge.js */
 /* @include src/profiles.js */
}
