labelSet = [];
window.addEventListener('storage', message_receive);
function message_receive(ev)
{
    if (ev.originalEvent.key!='message') return; // ignore other keys
    var message=JSON.parse(ev.originalEvent.newValue);
    if (!message) return; // ignore empty msg or msg reset

    // here you act on messages.
    // you can send objects like { 'command': 'doit', 'data': 'abcd' }
    console.log(message);
}