const popup = document.querySelector("#popup");
const openPopup = document.querySelector("#open-popup");
const closePopup = document.querySelector("#close-popup");
const allFriendsList = document.querySelector("#friend-list1");
const choosenFriendsList = document.querySelector("#friend-list2");
const allFriendsFilterInput = document.querySelector("#all-friends-input");
const choosenFriendsFilterInput = document.querySelector("#choosen-friends-input");

let friendListFragment = document.createDocumentFragment();
const emulKeyup = new Event("keyup");
let currentDrag;

let allFriendsArr = [];
let choosenFriendsArr = [];


let testData = [
    {
        name: "Pasha",
        lastName: "Simeshenko",
        photo: "url(http://cft2.mobimag.ru/Articles/11/2367/Image00001.jpg)",
        id: "1"
    },
    {
        name: "Eugeny",
        lastName: "Star-KOV",
        photo: "url(http://poradum.com/wp-content/uploads/2016/05/5093ed5387a1c42c56bbea32969fd854.jpg)",
        id: "2"
    },
    {
        name: "Roman",
        lastName: "Roman",
        photo: "url(https://avt-27.foto.mail.ru/mail/advokat22ru/_avatar180?)",
        id: "3"
    },
    {
        name: "Jana",
        lastName: "Kukuksumusu",
        photo: "url(http://1.bp.blogspot.com/_EDFqmuHfAF0/TRwcklAgEeI/AAAAAAAAGwg/hN2hxN5hxCQ/s400/Olivia%2BWilde-1-01.jpg)",
        id: "4"
    },
    {
        name: "Vadim",
        lastName: "Cipa-Cipa",
        photo: "url(http://images.hdbackgroundpictures.com/pictureHDt51a59ce016c2499075.jpg)",
        id: "5"
    },
]


//////////////////////////////////////////////////

function authVK() {
    return new Promise ((resolve, reject) => {
        VK.Auht.login(data => {
            if(data, session) {
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

function createFriendItem (name, lastName, photo, id, friendsList) {

    const friendItem = document.createElement('li');
    friendItem.classList.add('popup__all-friends-item');
    friendItem.classList.add('friend');
    friendItem.setAttribute("id", id);

    const friendPhoto = document.createElement('div');
    friendPhoto.classList.add('friend-photo');
    friendPhoto.style.backgroundImage = photo;
    friendItem.appendChild(friendPhoto);

    const friendName = document.createElement('div');
    friendName.classList.add('friend-name');
    friendName.textContent = `${name} ${lastName}`;
    friendItem.appendChild(friendName);

    const moveBtn = document.createElement('button');
    moveBtn.classList.add('friend-move');

    const moveBtnSVG = document.createElement('svg');
    moveBtnSVG.classList.add('icon');
    // const moveBtnUse = document.createElement('use');
    // moveBtnSVG.appendChild(moveBtnUse);
    // moveBtnUse.setAttribute("xlink:href", "svg/sprite.svg#icon-cross")

    const moveBtnSymb = document.createElement("symbol");
    const moveBtnPath = document.createElement("path");
    
    defineMoveBtn (moveBtnSVG, moveBtnPath, friendsList, id, friendItem);

    // if (friendsList !== choosenFriendsList) {
        
    //     console.log("невыбранный друг");
    //     moveBtnSVG.classList.add('icon-plus');
    //     moveBtnSVG.style.backgroundColor = "green";
    //     moveBtnPath.setAttribute("d", "M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z")

    //     moveBtnSVG.addEventListener("click", e => {

    //         transferArrElemBtn (allFriendsArr, choosenFriendsArr, id);
    //         console.log("Теперь избранные:", choosenFriendsArr);
    //         console.log("Теперь основные:", allFriendsArr);
    //         processInput (choosenFriendsFilterInput, choosenFriendsList, choosenFriendsArr);
    //         friendItem.remove();
    //     })

    // } else {
    //     console.log("выбранный друг");
    //     moveBtnSVG.classList.add('icon-cross');
    //     moveBtnSVG.style.backgroundColor = "red";
    //     moveBtnSVG.addEventListener("click", e => {

    //         transferArrElemBtn (choosenFriendsArr, allFriendsArr, id);
    //         console.log("Теперь избранные:", choosenFriendsArr);
    //         console.log("Теперь основные:", allFriendsArr);
    //         processInput (allFriendsFilterInput, allFriendsList, allFriendsArr);
    //         friendItem.remove();
    //     })
    // }

    


    moveBtnSymb.appendChild(moveBtnPath);
    moveBtnSVG.appendChild(moveBtnSymb);
    moveBtn.appendChild(moveBtnSVG);
    friendItem.appendChild(moveBtn);

    friendItem.draggable = true;
    return friendItem;
}

function defineMoveBtn (moveBtnSVG, moveBtnPath, currFriendsList, friendId, friendItem) {
    if (currFriendsList !== choosenFriendsList) {
        
        console.log("невыбранный друг");
        moveBtnSVG.classList.add('icon-plus');
        moveBtnSVG.style.backgroundColor = "green";
        moveBtnPath.setAttribute("d", "M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z")

        moveBtnSVG.addEventListener("click", e => {

            transferArrElemBtn (allFriendsArr, choosenFriendsArr, friendId);
            console.log("Теперь избранные:", choosenFriendsArr);
            console.log("Теперь основные:", allFriendsArr);
            processInput (choosenFriendsFilterInput, choosenFriendsList, choosenFriendsArr);
            friendItem.remove();
        })

    } else {
        console.log("выбранный друг");
        moveBtnSVG.classList.add('icon-cross');
        moveBtnSVG.style.backgroundColor = "red";
        moveBtnPath.setAttribute("d", "M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z")

        moveBtnSVG.addEventListener("click", e => {

            transferArrElemBtn (choosenFriendsArr, allFriendsArr, friendId);
            console.log("Теперь избранные:", choosenFriendsArr);
            console.log("Теперь основные:", allFriendsArr);
            processInput (allFriendsFilterInput, allFriendsList, allFriendsArr);
            friendItem.remove();
        })
    }

}


function filterFriendsArr (friendsArr, value) {
    const filteredFriends = friendsArr.filter(friend => {
        const fullName = `${friend.name.toUpperCase()} ${friend.lastName.toUpperCase()}`;
        return fullName.includes(value.toUpperCase()); // возвращает true/false
    })
    return filteredFriends;
}

function renderFriends(friendsArr, friendsList) {
    for (let friend of friendsArr) {
        const newFriendItem = createFriendItem(friend.name, friend.lastName, friend.photo, friend.id, friendsList);
        friendsList.appendChild(newFriendItem);
    }

    // allFriendsList.appendChild(friendListFragment);
    // friendListFragment = "";
}

function processInput (inputForm, friendsList, friendsArr) {
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

function transferArrElem (currArr, index, destArr) {
    destArr.push(currArr[index]);
    currArr.splice(index, 1);
}


function transferArrElemDND (currZoneArr, destZoneArr, dragNode) {

    for (let i = 0; i < currZoneArr.length; i++) {
        // console.log("id днд элемента:", dragNode.id);
        // console.log("id эл-та текущ списка друзей:", currZoneArr[i].id);
        if (currZoneArr[i].id === dragNode.id) {
            // console.log("совпало", dragNode.id);
            
            return transferArrElem(currZoneArr, i, destZoneArr);
        }
    }
}

function transferArrElemBtn (currZoneArr, destZoneArr, friendId) {

    for (let i = 0; i < currZoneArr.length; i++) {
        if (currZoneArr[i].id === friendId) {
            console.log("совпало", friendId);
            
            transferArrElem(currZoneArr, i, destZoneArr);
        }
    }
}


//////////////////////////////////// 

// openPopup.addEventListener("click", () => {
    
//     authVK()
//         .then(() => {
//             console.log("авторизация: успешно");
//             return callAPI("friends.get", {fields: "name, lastName, photo_100"}) // вернет data.response
//         })
//         .then(friends => {
//             console.log("загрузка друзей: успешно");
//             filterInput.addEventListener("keyup", friends => {
//                 if (filterInput.value) {

//                     while (allFriendsList.lastChild) {
//                         allFriendsList.lastChild.remove();
//                     }

//                     const allFriends = friends;
//                     const filteredFriends = friends.filter(friend => {
//                         const fullName = `${friend.name} ${friend.lastName}`;
//                         return fullName.includes(filterInput.value); // возвращает true/false
//                     })
//                     renderFriends(filteredFriends);
            
//                 } else {

//                     while (allFriendsList.lastChild) {
//                         allFriendsList.lastChild.remove();
//                     }

//                     renderFriends(allFriends);
//                 }
//             })

//             filterInput.dispatchEvent(emulKeyup);
//             popup.style.display = "flex";

//             closePopup.addEventListener("click", () => {
//                 popup.style.display = "none";
//             })


//         })
        
// })

allFriendsArr = testData;

openPopup.addEventListener("click", () => {

    processInput (allFriendsFilterInput, allFriendsList, allFriendsArr);
    popup.style.display = "flex";
    
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

                console.log("дропнули на новое место");

                if (e.target.classList.contains('friend')) {
                    console.log("дропнули на див друга");
                    zone.insertBefore(currentDrag.node, e.target.nextElementSibling);

                    
                } else if (e.target.parentElement.classList.contains('friend')) {
                    console.log("дропнули на что-то внутри дива друга");
                    zone.insertBefore(currentDrag.node, e.target.parentElement.nextElementSibling);

                } else {
                    console.log("дропнули на пустое место");
                    zone.appendChild(currentDrag.node);
                }
                console.log("положили друга в нужное место в дом");



                ////////// надо докопаться до кнопки:


                const moveBtnSVG = "";
                const moveBtnPath = "";
                // const currFriendsList = 
                const friendId = currentDrag.node.id;
                const friendItem = currentDrag.node;

                console.log(currentDrag.node.lastChild.children);

                for (node of currentDrag.node.lastChild.children) {
                    if (node.tagName === "svg") {
                        moveBtnSVG = node;
                    }
                    if (node.tagName === "path") {
                        moveBtnPath = node;
                    }
                }
                
                console.log("!!", moveBtnSVG);
                console.log(moveBtnPath);


                if (zone == choosenFriendsList) {
                    console.log("зона дропа - выбранные друзья: убираем из оновных, добавляем в избранные");
                    transferArrElemDND (allFriendsArr, choosenFriendsArr, currentDrag.node)
                    console.log("Теперь избранные:", choosenFriendsArr);
                    console.log("Теперь основные:", allFriendsArr);

                    // defineMoveBtn (moveBtnSVG, moveBtnPath, choosenFriendsList, friendId, friendItem);

                } else {
                    console.log("зона дропа - все друзья: убираем из избранных, добавляем в основные");
                    transferArrElemDND (choosenFriendsArr, allFriendsArr, currentDrag.node)
                    console.log(choosenFriendsArr);
                    console.log(allFriendsArr);

                    defineMoveBtn (moveBtnSVG, moveBtnPath, allFriendsList, friendId, friendItem);
                }
            }
            currentDrag = null;
        }
    });



    closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    })


})
        

