//localStorage helper functions
function set(index, value) {
    localStorage.setItem(index, JSON.stringify(value));
}
function get(index) {
    return JSON.parse(localStorage.getItem(index));
}
function has(index) {
    return localStorage.getItem(index) !== null;
}
function remove(index) {
    localStorage.removeItem(index);
}

export {set, get, has, remove};
