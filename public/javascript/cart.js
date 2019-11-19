var cart;

window.onbeforeunload = function() {
    return true;
};

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.onbeforeunload = null;
        window.open("cart.html", "_self", false);
    }
});

window.onload = () => {
    let url = new URL(window.location.href);
    var stringCart = url.searchParams.get("cart");
    cart = JSON.parse(stringCart);

    if (cart.length === 0) {
        window.location = "order.html";
    }

    reloadCart();
};

function removeItem(index) {
    cart.splice(index, 1);
    reloadCart();
}

function reloadCart() {
    let innerHTML = 0 < cart.length ? "" : "Cart Empty";
    let total = 0;

    for (i in cart) {
        let item = cart[i];
        innerHTML +=`<p><button onclick='removeItem(${i})'>Remove</button> ${item.name} ${item.combo ? "(combo)" : ""} - $${(item.combo ? 1.5 + item.price : item.price).toFixed(2)}</p>`;
        total += item.combo ? item.price + 1.5 : item.price;
    }

    document.getElementById("cart-items").innerHTML = innerHTML;
    document.getElementById("total").innerHTML = total.toFixed(2);
}

function goBack() {
    window.onbeforeunload = null;
    let cartData = encodeURIComponent(JSON.stringify(cart));
    let URL = `order.html?cart=${cartData}`;
    window.location = URL;
}

function placeOrder() {
    let fullName = document.getElementById("name").value;
    let emailAddress = document.getElementById("email").value;
    let phoneNumber = document.getElementById("phone").value;

    let data = {
        name: fullName,
        email: emailAddress,
        number: phoneNumber,
        data: cart
    };

    pushOrder(data)
    .then(() => {
        window.onbeforeunload = null;
        window.location = "/?confirm=1";
    })
    .catch((error) => {
        alert("Error");
        console.log(error);
    });
}

function pushOrder(data) {
    return new Promise((resolve, reject) => {
        let user = firebase.auth().currentUser;

        if (user) {
            let firebaseRef = firebase.database().ref().child(`users/${user.uid}`);
            firebaseRef
            .push(data)
            .then(() => {
                resolve();
            })
            .catch((error) => {
                let errorMessage = error.message;
                reject(errorMessage);
            });
        }
    });
}