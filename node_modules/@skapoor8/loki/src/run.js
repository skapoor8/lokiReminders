import TodoApp from './todoApp';

window.addEventListener('load', function() {
    var app = new TodoApp({selector: 'todo-app', toplevel: true});
    window.app = app;
});