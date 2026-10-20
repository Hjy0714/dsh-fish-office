// Keep worker and rendering-thread geometry identical; only path search runs off-thread.
window.OFFICE_NAV_WORKER_SOURCE=resource.navigationWorker;
(function(){
 const {path}=window.OfficeWorld;
 /* @include src/async-paths.js */
 Object.assign(window.OfficeWorld,{asyncPathStats,planPath,pathPending});
})();
