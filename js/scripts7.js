const popup = document.querySelector("#popup");
const openPopup = document.querySelector("#open-popup");
const closePopup = document.querySelector("#close-popup");
const allFriendsList = document.querySelector("#friend-list1");
const choosenFriendsList = document.querySelector("#friend-list2");
const allFriendsFilterInput = document.querySelector("#all-friends-input");
const choosenFriendsFilterInput = document.querySelector("#choosen-friends-input");
const saveBtn = document.querySelector("#save");


let friendsData;
let allFriendsArr = [];
let choosenFriendsArr = [];
let storage = localStorage;
let currentDrag;

let friendsListFragment = document.createDocumentFragment();



function authVK() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if(data.session) {
                resolve();
            } else {
                reject(new Error("Не удалось авторизоваться"));
            }
        }, 2);
    })
}

function callAPI(method, params) {
    params.v = "5.76";
    return new Promise((resolve, reject) =>{
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        })
    })
}

function createFriendItem(name, lastName, photo, id, friendsList) {

    const friendItem = document.createElement('li');
    friendItem.classList.add('popup__all-friends-item');
    friendItem.classList.add('friend');
    friendItem.setAttribute("id", id);

    const friendPhoto = document.createElement('div');
    friendPhoto.classList.add('friend-photo');
    friendPhoto.style.backgroundImage = `url(${photo})`;
    friendItem.appendChild(friendPhoto);

    const friendName = document.createElement('div');
    friendName.classList.add('friend-name');
    friendName.textContent = `${name} ${lastName}`;
    friendItem.appendChild(friendName);

    const moveBtn = document.createElement('button');
    moveBtn.classList.add('friend-move');

    const moveBtnIcon = document.createElement('img');
    moveBtnIcon.classList.add('friend-move-icon');

    
    defineMoveBtn(moveBtnIcon, friendsList, id, friendItem);


    moveBtn.appendChild(moveBtnIcon);
    friendItem.appendChild(moveBtn);

    friendItem.draggable = true;
    return friendItem;
}

function defineMoveBtn(moveBtnIcon, currFriendsList, friendId, friendItem) {
    if (currFriendsList !== choosenFriendsList) {
        
        console.log("невыбранный друг");

        moveBtnIcon.src = "img/plus.png";
        moveBtnIcon.alt = "Добавить";

        moveBtnIcon.addEventListener("click", e => {

            transferArrElemBtn(allFriendsArr, choosenFriendsArr, friendId);
            console.log("Теперь избранные:", choosenFriendsArr);
            console.log("Теперь основные:", allFriendsArr);
            processInput(choosenFriendsFilterInput, choosenFriendsList, choosenFriendsArr);
            friendItem.remove();
        })

    } else {
        console.log("выбранный друг");

        moveBtnIcon.src = "img/cross.png";
        moveBtnIcon.alt = "Удалить";

        moveBtnIcon.addEventListener("click", e => {

            transferArrElemBtn(choosenFriendsArr, allFriendsArr, friendId);
            console.log("Теперь избранные:", choosenFriendsArr);
            console.log("Теперь основные:", allFriendsArr);
            processInput(allFriendsFilterInput, allFriendsList, allFriendsArr);
            friendItem.remove();
        })
    }

}


function filterFriendsArr(friendsArr, value) {
    const filteredFriends = friendsArr.filter(friend => {
        const fullName = `${friend.first_name.toUpperCase()} ${friend.last_name.toUpperCase()}`;
        return fullName.includes(value.toUpperCase()); // возвращает true/false
    })
    return filteredFriends;
}

function renderFriends(friendsArr, friendsList) {

    for (let friend of friendsArr) {
        const newFriendItem = createFriendItem(friend.first_name, friend.last_name, friend.photo_100, friend.id, friendsList);
        // friendsListFragment.appendChild(newFriendItem); // почему не работает фрагмент??
        friendsList.appendChild(newFriendItem);
    }
    // console.log("Теперь фрагмент:", friendsListFragment);
    // friendsList.appendChild(friendsListFragment);
    // friendsListFragment = "";
}

function processInput(inputForm, friendsList, friendsArr) {
    if (inputForm.value) {

        while (friendsList.lastChild) {
            friendsList.lastChild.remove();
        }

        renderFriends((filterFriendsArr(friendsArr, inputForm.value)), friendsList);

    } else {

        while (friendsList.lastChild) {
            friendsList.lastChild.remove();
        }

        renderFriends(friendsArr, friendsList);
    }
}


function getCurrentZone(from) {
    do {
        if (from.classList.contains('drop-zone')) {
            return from;
        }
    } while (from = from.parentElement);

    return null;
}

function transferArrElem(currArr, index, destArr) {
    destArr.push(currArr[index]);
    currArr.splice(index, 1);
}


function transferArrElemDND(currZoneArr, destZoneArr, dragNode) {
    // console.log("id днд элемента:", dragNode.id);
    // console.log("id эл-та текущ списка друзей:", currZoneArr[0].id);
    for (let i = 0; i < currZoneArr.length; i++) {
        console.log("id днд элемента:", dragNode.id);
        console.log("id эл-та текущ списка друзей:", currZoneArr[i].id);
        if (currZoneArr[i].id == dragNode.id) { // типа одно строка, другое - число?? как правильно записать??
            console.log("совпало", dragNode.id, i);
            
            return transferArrElem(currZoneArr, i, destZoneArr);
        }
    }
}

function transferArrElemBtn(currZoneArr, destZoneArr, friendId) {

    for (let i = 0; i < currZoneArr.length; i++) {
        if (currZoneArr[i].id === friendId) {
            console.log("совпало", friendId);
            
            transferArrElem(currZoneArr, i, destZoneArr);
        }
    }
}


function popupAddListeners() {

    popup.addEventListener("keyup", e => {
    
        if (e.target === allFriendsFilterInput) {
            console.log("ввод в фильтр всех друзей");
            processInput (allFriendsFilterInput, allFriendsList, allFriendsArr);
        } else {
            console.log("ввод в фильтр выбранных друзей");
            processInput (choosenFriendsFilterInput, choosenFriendsList, choosenFriendsArr);
        }
    })

    document.addEventListener('dragstart', (e) => {
        const zone = getCurrentZone(e.target);

        if (zone) {
            currentDrag = {startZone: zone, node: e.target};
        }
    });

    document.addEventListener('dragover', (e) => {
        const zone = getCurrentZone(e.target);

        if (zone) {
            e.preventDefault();
        }
    });

    document.addEventListener('drop', (e) => {
        if (currentDrag) {
            const zone = getCurrentZone(e.target);

            e.preventDefault();

            if (zone && currentDrag.startZone !== zone) {
                zone.appendChild(currentDrag.node);

                if (zone == choosenFriendsList) {
                    console.log("зона дропа - выбранные друзья: убираем из оновных, добавляем в избранные");
                    transferArrElemDND (allFriendsArr, choosenFriendsArr, currentDrag.node);
                    console.log("Теперь избранные:", choosenFriendsArr);
                    console.log("Теперь основные:", allFriendsArr);

                    processInput (choosenFriendsFilterInput, choosenFriendsList, choosenFriendsArr);

                    if (choosenFriendsFilterInput.value) {
                        alert("Активен фильтр: друзья будут перенесены, но не будут отображены, если не соответствуют фильтру");
                    }

                } else {
                    console.log("зона дропа - все друзья: убираем из избранных, добавляем в основные");
                    transferArrElemDND (choosenFriendsArr, allFriendsArr, currentDrag.node)
                    console.log("Теперь избранные:", choosenFriendsArr);
                    console.log("Теперь основные:", allFriendsArr);

                    processInput (allFriendsFilterInput, allFriendsList, allFriendsArr);

                    if (allFriendsFilterInput.value) {
                        alert("Активен фильтр: друзья будут перенесены, но не будут отображены, если не соответствуют фильтру");
                    }

                }
                
            }
            currentDrag = null;
        }
    });
}

function popupAddButtons() {
    
    saveBtn.addEventListener("click", () => {
        storage.allFriendsArr = JSON.stringify(allFriendsArr);
        storage.choosenFriendsArr = JSON.stringify(choosenFriendsArr);
        alert("сохранено");
    })
    
    closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    })
}

function processFriendsAndOpenPopup() {

    processInput (allFriendsFilterInput, allFriendsList, allFriendsArr);
    processInput (choosenFriendsFilterInput, choosenFriendsList, choosenFriendsArr);
    popup.style.display = "flex";

    popupAddListeners();
    popupAddButtons();

}

//////////////////////////////////// 


openPopup.addEventListener("click", () => {

    if (storage.allFriendsArr || storage.choosenFriendsArr) {
        allFriendsArr = JSON.parse(storage.allFriendsArr);
        choosenFriendsArr = JSON.parse(storage.choosenFriendsArr);
        // storage.clear();

        processFriendsAndOpenPopup();

    } else {
        VK.init({
            apiId: 6498323
        });
    
        authVK()
            .then(() => {
                console.log("авторизация: успешно");
                return callAPI("friends.get", {fields: "name, lastName, photo_100"}) // вернет data.response
            })

            .then(friends => {
                console.log("загрузка друзей: успешно");
                console.log(friends);
                console.log(friends.items);

                allFriendsArr = friends.items;
                console.log(allFriendsArr[0]);
                console.log(allFriendsArr[0].id);

                processFriendsAndOpenPopup();

            })
    }
})

