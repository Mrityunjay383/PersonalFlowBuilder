function subscribe(eventName, listener) {
  document.addEventListener(eventName, listener);
}
async function subscribeDReturn(eventName, event2, listener) {
  document.addEventListener(eventName, listener);
  const d = await listener();
  const event = new CustomEvent("catchPosition", { detail: d });
  console.log(event);
  document.dispatchEvent(event);
}
function unsubscribe(eventName, listener) {
  document.removeEventListener(eventName, listener);
}

function publish(eventName, data) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}
function publishedReturn(eventName, data) {
  const event = new CustomEvent(eventName, { detail: data });
  console.log("====================================");
  console.log(event);
  console.log("====================================");
  document.dispatchEvent(event);
}
export { publish, subscribe, unsubscribe, subscribeDReturn, publishedReturn };
