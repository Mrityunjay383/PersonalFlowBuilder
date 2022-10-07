function subscribe(eventName, listener) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName, listener) {
  document.removeEventListener(eventName, listener);
}

function publish(eventName, data) {
  let event = new CustomEvent(eventName);
  for(let key in data){
    event[key]=data[key];
  }
  document.dispatchEvent(event);

}



function publishedReturn(eventName, data) {
  const event = new CustomEvent(eventName, {detail: data});
  event.event=data.event;
  event.node=data.node;
  document.dispatchEvent(event);
}

export {publish, subscribe, unsubscribe, publishedReturn};
