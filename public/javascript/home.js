window.onload = () => {
    let url = new URL(window.location.href);
    var stringCart = url.searchParams.get("confirm");
    let confirmation = JSON.parse(stringCart);

    if (confirmation) {
        alert("Order Complete");
    }
};