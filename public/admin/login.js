firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("not-signed-in").style.display = "none";
        document.getElementById("signed-in").style.display = "block";

        getData();
    }
    else {
        document.getElementById("not-signed-in").style.display = "block";
        document.getElementById("signed-in").style.display = "none";
    }
});

function switchToLogin() {
    document.getElementById("login").style.display = "block";
    document.getElementById("create_account").style.display = "none";
}

function switchToCreate() {
    document.getElementById("login").style.display = "none";
    document.getElementById("create_account").style.display = "block";
}

function startSignUp() {
    let email = document.getElementById("create_email").value;
    let password = document.getElementById("create_password").value;

    firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch((error) => {
        let errorMessage = error.message;
        reject(errorMessage);
    });
}

function startLogIn() {
    let email = document.getElementById("log_email").value;
    let password = document.getElementById("log_password").value;

    firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch((error) => {
        let errorMessage = error.message;
        reject(errorMessage);
    });
}

function logout() {
    firebase.auth().signOut()
    .catch((error) => {
        let errorMessage = error.message;
        alert(errorMessage);
    });
}

function getData() {
    let firebaseRef = firebase.database().ref("users");
    firebaseRef.on("value", (snapshot) => {
        loadData(snapshot.val());
    });
}

function loadData(orders) {
    let innerHTML = orders === null ? "No orders" : "";

    for (i in orders) {
        let user = orders[i];

        for (j in user) {
            let order = user[j];

            innerHTML += `<div class="orders">Name: ${order.name}<br>Phone Number: ${order.number}<br>Email: ${order.email}<hr><div class="order">$order</div><br><button onclick="removeItem('${i}', '${j}')">Delete</button></div><br>`;

            let orderHTML = "";
            for (k in order.data) {
                let item = order.data[k];
                orderHTML += `<li>${item["name"]} ${item["combo"] ? "(combo)" : ""}</li>`;
            }

            innerHTML = innerHTML.replace("$order", orderHTML);
        }
    }

    document.getElementById("data").innerHTML = innerHTML;
}

function removeItem(user, key) {
    let firebaseRef = firebase.database().ref().child(`users/${user}/${key}`);
    firebaseRef.remove();
}