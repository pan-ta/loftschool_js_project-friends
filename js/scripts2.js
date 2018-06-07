const popup = document.querySelector("#popup");
const openPopup = document.querySelector("#open-popup");
const closePopup = document.querySelector("#close-popup");
const allFriendsList = document.querySelector("#friend-list1");
const choosenFriendsList = document.querySelector("#friend-list2");
const filterInput = document.querySelector("#name-input");

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
        name: "Misha",
        lastName: "Los",
        photo: "url(http://poradum.com/wp-content/uploads/2016/05/5093ed5387a1c42c56bbea32969fd854.jpg)",
        id: "2"
    },
    {
        name: "Roma",
        lastName: "Zver",
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

function createFriendItem (name, lastName, photo, id) {

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

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('friend-add');
    const deleteBtnSVG = document.createElement('svg');
    deleteBtnSVG.classList.add('icon');
    deleteBtnSVG.classList.add('icon-cross');
    // deleteBtnSVG.use = "(xlink:href="../svg/sprite.svg#icon-cross")" // как свг??

    deleteBtn.addEventListener("click", () => {
        friendItem.remove();
    })

    deleteBtn.appendChild(deleteBtnSVG);
    friendItem.appendChild(deleteBtn);

    friendItem.draggable = true;
    return friendItem;
}



function filterFriendsArr (FriendsArr, value) {
    const filteredFriends = FriendsArr.filter(friend => {
        const fullName = `${friend.name.toUpperCase()} ${friend.lastName.toUpperCase()}`;
        return fullName.includes(value.toUpperCase()); // возвращает true/false
    })
    return filteredFriends;
}

function renderFriends(friends) {
    for (let friend of friends) {
        const newFriendItem = createFriendItem(friend.name, friend.lastName, friend.photo, friend.id);
        allFriendsList.appendChild(newFriendItem);
    }

    // allFriendsList.appendChild(friendListFragment);
    // friendListFragment = "";
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
        console.log("id днд элемента:", dragNode.id);
        console.log("id эл-та текущ списка друзей:", currZoneArr[i].id);
        if (currZoneArr[i].id === dragNode.id) {
            console.log("совпало", dragNode.id);
            
            return transferArrElem(currZoneArr, i, destZoneArr);
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
    

            filterInput.addEventListener("keyup", () => {

                if (filterInput.value) {

                    while (allFriendsList.lastChild) {
                        allFriendsList.lastChild.remove();
                    }

                    // const {value} = filterInput; // зачем??


                    renderFriends(filterFriendsArr(allFriendsArr, filterInput.value));
            
                } else {

                    while (allFriendsList.lastChild) {
                        allFriendsList.lastChild.remove();
                    }

                    renderFriends(allFriendsArr);
                }
            })

            filterInput.dispatchEvent(emulKeyup);
            popup.style.display = "flex";


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

                        if (zone == choosenFriendsList) {
                            console.log("зона дропа - выбранные друзья: убираем из оновных, добавляем в избранные");
                            transferArrElemDND (allFriendsArr, choosenFriendsArr, currentDrag.node)
                            console.log("Теперь избранные:", choosenFriendsArr);
                            console.log("Теперь основные:", allFriendsArr);

                        } else {
                            console.log("зона дропа - все друзья: убираем из избранных, добавляем в основные");
                            transferArrElemDND (choosenFriendsArr, allFriendsArr, currentDrag.node)
                            console.log(choosenFriendsArr);
                            console.log(allFriendsArr);
                        }
                    }
                    currentDrag = null;
                }
            });



            closePopup.addEventListener("click", () => {
                popup.style.display = "none";
            })


        })
        




/////////////////

