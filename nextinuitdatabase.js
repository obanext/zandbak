let objectDatabase = [];

function saveToLocalStorage() {
    localStorage.setItem('objectDatabase', JSON.stringify(objectDatabase));
}

function loadFromLocalStorage() {
    const storedObjects = localStorage.getItem('objectDatabase');
    if (storedObjects) {
        objectDatabase = JSON.parse(storedObjects);
    } else {
        objectDatabase = [];
    }
}


loadFromLocalStorage();
