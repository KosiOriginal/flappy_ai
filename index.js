const player = document.getElementById("player");
    let y = 500;
    let spacePressed = false;

    document.body.focus(); // гарантира фокус

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && !spacePressed) {
            e.preventDefault();
            spacePressed = true;

            y -= 35;
            player.style.top = y + "px";
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.code === "Space") {
            spacePressed = false;
        }
    });
