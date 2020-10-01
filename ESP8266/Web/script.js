let PAUSED = false;
let STARTED = false;

let INTERVAL = 0;
let FRAMES = 0;
let FPS = 0;

let SHOOT = "00:00";
let DURATION = "00:00";

/* Timelapser */
let _shoted = 0

function timelapser() {
    _shoted++;

    // TODO: api request for getting shoted frames

    if (_shoted >= FRAMES) {
        clearInterval(timerTL);
        clearInterval(timerGUI);
        
        gui_updater();

        // Unocking fields
        document.getElementById('param-interval').readOnly = false;
        document.getElementById('param-frames').readOnly = false;
        document.getElementById('param-shoot').readOnly = false;
        document.getElementById('param-fps').readOnly = false;
        document.getElementById('param-duration').readOnly = false;
        
        let btn = document.getElementById("start-stop");
        btn.className = "start";
        btn.innerText = "Start";

        document.getElementById("progress-time").innerText = "0:0:0";

        STARTED = false
        _shoted = 0
    }
}

let timerTL = undefined;
let timerGUI = undefined;
/* ---------- */ 

/* Buttons */
function btn_start_stop() {
    let btn = document.getElementById("start-stop")
    
    if (!STARTED) {
        if (INTERVAL == 0 || FRAMES == 0) {
            alert("Wrong values! Interval and frames can not be 0!");
            return;
        }
        
        // Locking fields
        document.getElementById('param-interval').readOnly = true;
        document.getElementById('param-frames').readOnly = true;
        document.getElementById('param-shoot').readOnly = true;
        document.getElementById('param-fps').readOnly = true;
        document.getElementById('param-duration').readOnly = true;
        
        // Starting timers
        timerTL = setInterval(timelapser, INTERVAL * 1000);
        timerGUI = setInterval(update_fields, 1000);

        btn.className = "stop";
        btn.innerText = "Stop";
        
        update_fields();

        // TODO: api request
    } else {
        if (!confirm("sure?"))
            return
        
        // Unocking fields
        document.getElementById('param-interval').readOnly = false;
        document.getElementById('param-frames').readOnly = false;
        document.getElementById('param-shoot').readOnly = false;
        document.getElementById('param-fps').readOnly = false;
        document.getElementById('param-duration').readOnly = false;

        if (PAUSED)
            document.getElementById("pause").click();

        clearInterval(timerTL);
        clearInterval(timerGUI);

        btn.className = "start";
        btn.innerText = "Start";

        _shoted = 0

        update_fields();

        document.getElementById("progress-time").innerText = "00:00:00";

        // TODO: api request
    }

    STARTED = !STARTED;
}

function btn_pause() {
    if (!STARTED)
        return
    
    let btn = document.getElementById("pause");
    let bar = document.getElementById("progress-bar");

    if (!PAUSED) {
        btn.className = "continue";
        btn.innerText = "Continue";
        
        clearInterval(timerTL);
        clearInterval(timerGUI);

        bar.className = "bar-paused";

        // TODO: api request
    } else {
        btn.className = "pause";
        btn.innerText = "Pause";
        
        // Starting timers
        timerTL = setInterval(timelapser, INTERVAL * 1000);
        timerGUI = setInterval(update_fields, 1000);

        bar.className = "bar";

        // TODO: api request
    }

    PAUSED = !PAUSED;
}
/* --------- */

function update_fields() {
    document.getElementById('param-interval').value = INTERVAL;
    document.getElementById('param-frames').value = FRAMES;
    document.getElementById('param-shoot').value = SHOOT;
    document.getElementById('param-fps').value = FPS;
    document.getElementById('param-duration').value = DURATION;

    let bar = document.getElementById("progress-bar");
    let frames = document.getElementById("progress-frames");
    let timer = document.getElementById("progress-time");

    bar.max = FRAMES;
    bar.value = _shoted;

    frames.innerText = _shoted + '/' + FRAMES;

    h = Math.floor((FRAMES - _shoted) * INTERVAL / 3600)
    m = Math.floor((FRAMES - _shoted) * INTERVAL % 3600 / 60)
    s = (FRAMES - _shoted) * INTERVAL % 60

    timer.innerText = h + ':' + m + ':' + s
}

function get_shoot() {
    if (FRAMES <= 0 || INTERVAL <= 0)
        return
    
    h = Math.floor((FRAMES * INTERVAL) / 3600) + '';
    m = Math.floor((FRAMES * INTERVAL) % 3600 / 60) + '';

    h.length < 2 ? h = '0' + h : h = h;
    m.length < 2 ? m = '0' + m : m = m;

    SHOOT = h + ':' + m;
}

function get_duration() {
    if (FRAMES <= 0 || FPS <= 0)
        return
    
    m = Math.floor(FRAMES / FPS / 60) + '';
    s = Math.floor(FRAMES / FPS) % 60 + '';

    m.length == 1 ? m = '0' + m : m = m;
    s.length == 1 ? s = '0' + s : s = s;

    DURATION = m + ':' + s;
}

function convert_shoot() {
    arr = SHOOT.split(':'); // Hours and minutes
    // Seconds
    s = Number(arr[0]) * 3600 + Number(arr[1]) * 60;

    if (INTERVAL != 0) {
        FRAMES = Math.ceil(s / INTERVAL);
        get_shoot();
        get_duration();
    } else if (FRAMES != 0) {
        INTERVAL = Math.round(s / FRAMES);
        get_shoot();
    }
}

function convert_duration() {
    arr = DURATION.split(':'); // Minutes and seconds
    // Seconds
    s = Number(arr[0]) * 60 + Number(arr[1]);

    if (FPS != 0) {
        FRAMES = s * FPS;
        get_shoot();
        get_duration();
    } else if (FRAMES != 0) {
        FPS = Math.round(FRAMES / s);
        get_duration();
    }
}

function count_values(event) {
    switch (event.target.id) {
        case 'param-interval':
            INTERVAL = Number(event.target.value);
            get_shoot();
            break;
        case 'param-frames':
            FRAMES = Number(event.target.value);
            get_shoot();
            get_duration();
            break;
        case 'param-shoot':
            SHOOT = event.target.value;
            convert_shoot();
            break;
        case 'param-fps':
            FPS = Number(event.target.value);
            get_duration();
            break;
        case 'param-duration':
            DURATION = event.target.value;
            convert_duration();
            break;
    }

    update_fields();
}

function onLoad() {
    // Adding events
    inputs = document.getElementsByTagName('input');
    
    for (let i = 0; i < inputs.length; i++){
        inputs[i].addEventListener('input', count_values);
    }
}