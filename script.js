let sfxAssets = {
    tick1: "assets/tick1.wav",
    tick2: "assets/tick2.wav",
    theme: "assets/LDCAmb.ogg",
    static: "assets/static.mp3",
}
let SFX = {};
for (let sound in sfxAssets) {
    SFX[sound] = new Audio(sfxAssets[sound]);
}
console.log(SFX);
for (let i = 1; i<4; i++) {
    document.getElementById("background"+i).style.backgroundPositionY = Math.random() * 2000 + "px";
}
document.getElementById("decimalAmount").addEventListener("change", () => {
    if (document.getElementById("decimalAmount").value >= 100)
        document.getElementById("decimalAmount").value = 100;
    fixedAmount = document.getElementById("decimalAmount").value;
});
document.getElementById("pizzaManStart").addEventListener("click", () => {
    pizzaManEnabled = true;
});
document.getElementById("goBack").addEventListener("click", () => {
    pizzaManEnabled = false;
});
let fixedAmount = 0;
const dateLdcStart = new Date("2026-03-27T19:57:30+03:00");
let lastTime = 0;
const siteDate = new Date();
console.log(siteDate);
let transitionOpacity = 1.3;
let volumeTransition = -0.3;
let volumeDisplay = 0;
let pizzaManEnabled = false;
let firstFrame = [false, false];
let tick = false;
let values = [0,0];
let timerShake = 0;
function secondsToClock(ms) {
    const newSec = ms / 1000 % 60;
    const min = ms / 1000 / 60 % 60;
    const hrs = ms / 1000 / 60 / 60 % 24;
    const days = ms / 1000 / 60 / 60 / 24;
    return Math.floor(days) + ":" + Math.floor(hrs) + ":" + (min <= 10 ? + "0" : "") + Math.floor(min) + ":" + (newSec <= 10 ? + "0" : "") + Math.floor(newSec);
}
function update(time) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    const now = new Date();
    const timeDiff = now - dateLdcStart;
    for (let i = 1; i<4; i++) {
        document.getElementById("background"+i).style.backgroundPositionX = time * i / 3 + "px";
        document.getElementById("background"+i).style.backgroundPositionY = time * i / 6 + "px";
    }
    if (!pizzaManEnabled) {
        if (!firstFrame[0]) {
            firstFrame[0] = true;
            firstFrame[1] = false;
            document.getElementById("entireBody").style = "position: absolute; inset: 0;";
        }
        document.getElementById("mainPage").style.display = "block";
        document.getElementById("pizzaManTimer").style.display = "none";

        transitionOpacity -= dt / 5;
        volumeTransition += dt / 5;

        document.getElementById("transition").style.opacity = transitionOpacity;
        SFX.theme.play();
        volumeDisplay = volumeTransition;
        if (volumeTransition >= 1) volumeDisplay = 1;
        if (volumeTransition <= 0) volumeDisplay = 0; 
        for (let sound in sfxAssets) {
            SFX[sound].volume = volumeDisplay;
        }
        document.getElementById("overallLDCTimer").textContent = dateLdcStart;
        document.getElementById("stopwatchLDC").textContent = secondsToClock(now - dateLdcStart);
        if (fixedAmount !== 0) {
            document.getElementById("daysSinceLDC").textContent = "Days since LDC: " + (timeDiff/1000/60/60/24).toFixed(fixedAmount);
            document.getElementById("hoursSinceLDC").textContent = "Hours since LDC: " + (timeDiff/1000/60/60).toFixed(fixedAmount);
            document.getElementById("minutesSinceLDC").textContent = "Minutes since LDC: " + (timeDiff/1000/60).toFixed(fixedAmount);
            document.getElementById("secondsSinceLDC").textContent = "Seconds since LDC: " + (timeDiff/1000).toFixed(fixedAmount);
            document.getElementById("msSinceLDC").textContent = "MS since LDC: " + (timeDiff).toFixed(fixedAmount);
            document.getElementById("siteTime").textContent = ((now - siteDate) / 1000).toFixed(fixedAmount) + "s";
        } else {
            document.getElementById("daysSinceLDC").textContent = "Days since LDC: " + Math.floor(timeDiff/1000/60/60/24);
            document.getElementById("hoursSinceLDC").textContent = "Hours since LDC: " + Math.floor(timeDiff/1000/60/60);
            document.getElementById("minutesSinceLDC").textContent = "Minutes since LDC: " + Math.floor(timeDiff/1000/60);
            document.getElementById("secondsSinceLDC").textContent = "Seconds since LDC: " + Math.floor(timeDiff/1000);
            document.getElementById("msSinceLDC").textContent = "MS since LDC: " + Math.floor(timeDiff);
            document.getElementById("siteTime").textContent = Math.floor((now - siteDate) / 1000) + "s";
        }
    } else {
        if (!firstFrame[1]) {
            firstFrame[1] = true;
            firstFrame[0] = false;
            tick = false;
            transitionOpacity = 1;
            values[0] = Math.floor((timeDiff/1000));
            values[1] = Math.floor((timeDiff/1000));
            document.getElementById("entireBody").style = "position: absolute; inset: 0; filter: url(#red);";
            
        }
        transitionOpacity -= dt / 5;
        document.getElementById("transition").style.opacity = transitionOpacity;
        document.getElementById("secondTimer").textContent = secondsToClock(timeDiff);
        values[1] = values[0];
        values[0] = Math.floor((timeDiff/1000));
        if (Math.floor((timeDiff/10)) % 5 == 0) {
            for (let i = 1; i<4; i++) {
                document.getElementById("fogTimer"+i).style.transform = `translate(${-(Math.random() * 5 + 47.5)}%,${-(Math.random() * 5 + 47.5)}%)`;
                document.getElementById("fogTimer"+i).textContent = document.getElementById("secondTimer").textContent;
            }
        }
        if (values[0] != values[1]) {
            tick = !tick;
            if (tick) {
                SFX.tick1.play();
            } else {
                SFX.tick2.play();
            }
            timerShake = 4;
        }
        document.getElementById("entireBody").style.transform = `translate(${-(Math.random() * timerShake - timerShake/2)}%,${-(Math.random() * timerShake - timerShake/2)}%)`;
        timerShake -= dt * 5;
        if (timerShake < 0) timerShake = 0;
        document.getElementById("mainPage").style.display = "none";
        document.getElementById("pizzaManTimer").style.display = "block";
    }
    requestAnimationFrame(update);
}
requestAnimationFrame(update);