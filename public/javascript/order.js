var cart;

window.onload = () => {
    let url = new URL(window.location.href);
    var stringCart = url.searchParams.get("cart");
    cart = JSON.parse(stringCart);

    if (cart === null) {
        cart = [];
    }

    reloadCart();
};

function addItem(itemName, itemPrice, itemCombo=false) {
    let cartItem = {
        name: itemName,
        price: itemPrice,
        combo: itemCombo
    };

    cart.push(cartItem);
    reloadCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    reloadCart();
}

function reloadCart() {
    let innerHTML = 0 < cart.length ? "" : "Awaiting your selections";
    let total = 0;

    if (cart.length == 0) {
        window.onbeforeunload = null;
    }
    else {
        window.onbeforeunload = () => { return true; };
    }

    for (i in cart) {
        let item = cart[i];
        innerHTML +=`<p><button onclick='removeItem(${i})'>Remove</button> ${item.name} ${item.combo ? "(combo)" : ""} - $${(item.combo ? 1.5 + item.price : item.price).toFixed(2)}</p>`;
        total += item.combo ? item.price + 1.5 : item.price;
    }

    document.getElementById("checkout-items").innerHTML = innerHTML;
    document.getElementById("total").innerHTML = total.toFixed(2);
}

function checkOut() {
    login()
    .then(() => {
        window.onbeforeunload = null;
        let cartData = encodeURIComponent(JSON.stringify(cart));
        let URL = `cart.html?cart=${cartData}`;
        window.location = URL;
    })
    .catch((error) => {
        alert(error);
    });
}

function login() {
    return new Promise((resolve, reject) => {
        let user = firebase.auth().currentUser;

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

        if (!user) {
            firebase.auth()
            .signInAnonymously()
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject("Error");
            });
        }
        else {
            resolve();
        }
    });
}