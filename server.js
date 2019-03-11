var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); //server
var port = process.env.PORT || 3000;

var maze = [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
[0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
[0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]];
var position = [[11, 1]];
var maze_x = 11;
var maze_y = 1;
var direction = 'E';
var state = 'startgame';
var status_state = 0;
var pass = 0;
var text = null;
var position_flag = true;
var modify_flag = false;
var delete_flag = false;
var play_flag = false;
var reset_flag = false;
var repeat_flag = false;
var insert_flag = false;
var crash_flag = false;
var havetoDo_flag = false;
var test_flag = false;
var maze_state = null;
var num = 500;
var ee = 3;
var already = null;
var anser = null;
var test_state = null;
var order = null, distance = null, forward_backward_direction = null, left_right_direction = null, direction_return = null;
var modify = null, delete_code = null, insert = null, play = null, reset = null, numberSequence = null, insertPosition = null, number = null, insert_position = null;
var number_deletecode = null;
var startgame = null, language;
var tutorial_test = 'start2';
// var tutorial_state = null;
var character;
var godmode = null;
var state_godmode = null;
var arrayOrder = [];
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/', (req, res) => {

    console.log("***************************************************************************************************")
    console.log(req.body);
    if (!req.body) return res.sendStatus(400)
    var keep = req.body.queryResult.parameters;
    var responsetext = req.body.queryResult.fulfillmentText;
    //     console.log('res is ',responsetext);

    if (text != null) {
        console.log('sh resend ', text);
    }

    forward_backward_direction = keep.order;
    left_right_direction = keep.direction;
    direction_return = keep.return;
    distance = keep.distance;
    startgame = keep.startgame;
    play = keep.play;
    anser = keep.anser;
    test_state = keep.test;
    character = keep.actor;
    // tutorial_state = keep.state;
    // tutorial_num_state = keep['num-state']
    godmode = keep.godmode;
    state_godmode = keep.state;
    reset = keep.reset;
    modify = keep.modify;
    already = keep.already;
    numberSequence = keep.position;
    delete_code = keep.delete;
    insert = keep.insert;
    insertPosition = keep['insert-position'];
    language = req.body.queryResult.languageCode;
    console.log('Version is ', language);
    if (forward_backward_direction != null) {
        order = forward_backward_direction;
        console.log('show forward_backeard_direction ', order);
    } else if (left_right_direction != null) {
        order = left_right_direction;
        console.log('show left_right_direction ', order);
    }
    else if (direction_return != null) {
        order = 'หันขวา';
        console.log('show return ', order, 'distance ', distance);
    }

    if (godmode != null && state_godmode != null) {
        status_state = state_godmode;
        pass = 0;
        console.log('godmode ', godmode, 'state ', status_state);
        if (status_state == 2) {
            state = 'tutorial_state1';
        }
        else if (status_state == 3) {
            state = 'test1-1';
        }
        else if (status_state == 4) {
            state = 'test1-2';
        }
        else if (status_state == 5) {
            state = 'test1-3';
        }
        else if (status_state == 6) {
            state = 'test1-4';
        }
        else if (status_state == 7) {
            state = 'test1-5';
        }
        else if (status_state == 8) {
            tutorial_test = 'start2';
            state = 'test2';
        }
        else if (status_state == 9) {
            state = 'tutorial_state2';
        }
        else if (status_state == 10) {
            tutorial_test = 'start3';
            state = 'test3';
        }
        else if (status_state == 11) {
            state = 'tutorial_state3';
        }
        else if (status_state == 12) {
            tutorial_test = 'start4';
            state = 'test4';
        }
        else if (status_state == 13) {
            state = 'tutorial_state4-1';
        }
        else if (status_state == 14) {
            state = 'tutorial_state4-2';
        }
        else if (status_state == 15) {
            tutorial_test = 'start5';
            state = 'test5';
        }
        else if (status_state > 100) {
            resetPosition();
            resetArrayOrder();
            maze = [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]];
            if (status_state == 101) {
                state = 'maze1';
                maze_state = 'maze1';
                status_state = null;
                responsetext = 'ต้องใช้คำสั่งที่เรียนมาเดินเข้าประตูให้ได้นะ';
            } else if (status_state == 102) {
                state = 'maze2';
                maze_state = 'maze2';
                status_state = null;
                responsetext = 'ด่าน 2 แล้วนะ';
            } else if (status_state == 103) {
                state = 'maze3';
                maze_state = 'maze3';
                status_state = null;
                responsetext = 'ด่าน 3 แล้วนะ';
            } else if (status_state == 104) {
                state = 'maze4';
                maze_state = 'maze4';
                status_state = null;
                responsetext = 'ด่าน 4 แล้วนะ';
            } else if (status_state == 105) {
                state = 'maze5';
                maze_state = 'maze5';
                status_state = null;
                responsetext = 'ด่าน 5 แล้วนะ';
            } else if (status_state == 106) {
                state = 'maze6';
                maze_state = 'maze6';
                status_state = null;
                responsetext = 'ด่าน 6 แล้วนะ';
            }
        }
        console.log('arr position ', position);
        console.log('x ', maze_x, ' y ', maze_y);
    }
    //show value
    else if (req.body.queryResult.action == 'input.welcome') {
        status_state = 0;
        pass = 0;
        state = 'startgame';
        tutorial_test = 'start2';
        ee = 3;
        havetoDo_flag = false;
        resetPosition();
        resetArrayOrder();
        console.log('all position when restart', position);
        console.log('array of order when restart', arrayOrder);
    }
    else if (startgame != null && status_state == 0) {
        status_state = 1;
        state = 'character';
        console.log('show start ', startgame);
        // console.log('Do is ',havetoDo_flag);
    }
    else if (character != null && state == 'character') {
        if (status_state == 1) {
            console.log('actor is ', character);
            if (character == "1" || character == "2") {
                console.log('character is ', character);
                state = 'tutorial_state1';
                status_state = 2;
            }
            else {
                responsetext = 'you can choose 1 or 2 only';
            }
        } else {
            responsetext = 'Sorry, could you say that again?';
        }
    }
    else if (play != null) {
        console.log('play is ', play);
        play_flag = true;
        if (status_state == 10) {
            console.log('tutorial_state10_play_flag ', play_flag);
        } else if (status_state == 12) {
            modify_flag = false;
            number = null;
            console.log('tutorial_state12_play_flag ', play_flag);
        } else if (status_state == 15) {
            insert_flag = false;
            insert_position = null;
            number = null;
            console.log('tutorial_state15_play_flag ', play_flag);
        } else {
            playFunction();
        }
    }
    else if (test_state != null) {
        test_flag = true;
    }
    else if (anser != null) {
        console.log('anser is ', anser);
    }
    else if (already != null) {
        console.log('tutorial already ', already);
    }


    if (modify != null) {
        modify_flag = true;
        number = numberSequence;
        console.log('he will ', modify, 'status-mod ', modify_flag, ' in number ', numberSequence);
    }
    else if (delete_code != null) {
        number_deletecode = numberSequence;
        delete_flag = true;
        console.log('he will ', delete_code, 'status-delete ', delete_flag, ' delete_number ', numberSequence);
        if (status_state == 10) {
            console.log('go to 10');
        } else {
            deleteCode();
        }
    }
    else if (insert != null) {
        number = numberSequence;
        insert_position = insertPosition;
        insert_flag = true;
        if (language == 'th') {
            if (insert_position == 'ก่อน') {
                insert_position = 'before';
            }
            else if (insert_position == 'หลัง') {
                insert_position = 'after';
            }
        }
        console.log('he will ', insert, ' ', insertPosition, ' number ', numberSequence);
    }
    else if (reset != null) {
        if (status_state == 8 || status_state == 10 || status_state == 12 || status_state == 15) {
            reset_flag = true;
            console.log('reset state tu go to');
        }
        else if (status_state == null) {
            if (ee > 0) {
                ee = ee - 1;
                console.log('ee ', ee);
                if (ee == 1) {
                    responsetext = 'เหลือหัวใจแค่ 1 ดวงแล้วนะ';
                } else if (ee == 0) {
                    responsetext = 'หัวใจหมดแล้วนะ ใช้คำสั่งเริ่มต้นใหม่ไม่ได้แล้วนะ';
                }
                console.log('reset in true_state ', reset);
                reset_flag = true;
                resetPosition();
                resetArrayOrder();
            } else {
                responsetext = 'ไม่สามารถใช้คำสั่งเริ่มต้นใหม่แล้วนะ'
            }
        }
        console.log('reset_flag ', reset_flag);
    }
    else if (numberSequence != null) {
        if (modify_flag == true) {
            number = numberSequence;
        }
        else if (insert_flag == true) {
            number = numberSequence;
            insert_position = insertPosition;
            if (language == 'th') {
                if (insert_position == 'ก่อน') {
                    insert_position = 'before';
                }
                else if (insert_position == 'หลัง') {
                    insert_position = 'after';
                }
            }
            console.log('he will ', insert, ' ', insertPosition, ' number ', numberSequence);

        }
        else {
            responsetext = 'ขอโทษค่ะ ฉันไม่เข้าใจ';
        }
    }

    if (order != null && distance != null) {
        if (language == 'th') {
            if (order == "เดินหน้า") {
                order = "forward";
            }
            else if (order == "ถอยหลัง") {
                order = "backward";
            }
            else if (order == "หันซ้าย") {
                order = "left";
            }
            else if (order == "หันขวา") {
                order = "right";
            }
        }
        if (status_state == 8) {
            console.log('go to state 8');
        }
        else if (status_state == 10) {
            console.log('got to state 10');
        }
        else if (status_state == 12) {
            console.log('go to state 12');
        }
        else if (status_state == 15) {
            console.log('go to state 15');
        }
        else {
            console.log('sh order', order, 'show distance ', distance);
            ComputePosition();
            keepArrayOrder();
            checkState();
        }

    }

    console.log('status_state ', status_state);

    var maze_tutorial_test35 = [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]];

    var maze_tutorial_test2 = [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]];

    var maze_tutorial_test4 = [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]];




    //tutorial*************************************************************************************
    if (status_state == 2) {
        if (test_flag) {
            state = 'test1-1';
            responsetext = 'ตั้งใจฟังนะ การเดินในรูปด้านซ้าย     เกิดจาก    คำสั่งต่างๆ      ในรูปด้านขวา   ใช่หรือไม่';
            status_state = 3;
        } else {
            responsetext = 'พูดว่าทดสอบ ก่อนนะ';
        }
    }
    else if (status_state == 3) {
        //1
        if (anser == 'false') {
            state = 'test1-2';
            responsetext = 'เก่งมากเลย ทำอีกข้อนะ';
            pass++;
            status_state = 4;
        }
        else if (anser == 'true') {
            state = 'test1-2';
            responsetext = 'ยังไม่ถูกนะลองทำข้อใหม่ดูอีกทีนะ';
            status_state = 4;
        }
        else {
            responsetext = 'การเดินในรูปด้านซ้าย     เกิดจาก    คำสั่งต่างๆ      ในรูปด้านขวา    ใช่หรือไม่';
        }
        console.log('pass ', pass);
    }
    else if (status_state == 4) {
        //2
        if (anser == 'true') {
            state = 'test1-3';
            pass++;
            responsetext = 'เก่งมากเลย ไปข้อต่อไปเลย';
            status_state = 5;
        }
        else if (anser == 'false') {
            state = 'test1-3';
            if (pass == 0) {
                responsetext = 'ถ้ายังทำข้อต่อไปไม่ได้จะไม่ผ่านการทดสอบนะ';
            }
            else {
                responsetext = 'ไม่ถูกนะข้อต่อไปดูดีดีนะ'
            }
            status_state = 5;
        }
        else {
            responsetext = 'การเดินในรูปด้านซ้าย     เกิดจาก    คำสั่งต่างๆ      ในรูปด้านขวา   ใช่หรือไม่';
        }
        console.log('pass ', pass);
    }
    else if (status_state == 5) {
        //3
        if (anser == 'false') {
            pass++;
            if (pass == 3) {
                responsetext = 'เก่งที่สุดเลย ต่อไปต้องเล่นเองแล้วนะ เดินเข้าประตูให้ได้นะจ๊ะ';
                status_state = 8;
                state = 'test2';
            } else {
                responsetext = 'เก่งมากเลย ไปข้อต่อไปเลย';
                state = 'test1-4';
                status_state = 6;
            }
        }
        else if (anser == 'true') {
            if (pass == 0) {
                state = 'startgame';
                responsetext = 'ยังไม่ผ่านการทดสอบนะคะ เสียใจด้วย';
                status_state = 0;
            } else {
                responsetext = 'ยังไม่ถูกนะคะ ไปข้อต่อไปเลย';
                state = 'test1-4';
                status_state = 6;
            }
        }
        else {
            responsetext = 'การเดินในรูปด้านซ้าย     เกิดจาก    คำสั่งต่างๆ      ในรูปด้านขวา    ใช่หรือไม่';
        }
        console.log('pass ', pass);
    }
    else if (status_state == 6) {
        //4
        if (anser == 'true') {
            pass++;
            if (pass == 3) {
                responsetext = 'เก่งที่สุดเลย ต่อไปต้องเล่นเองแล้วนะ เดินเข้าประตูให้ได้นะจ๊ะ';
                status_state = 8;
                state = 'test2';
            } else {
                responsetext = 'เก่งมากเลย ข้อสุดท้ายต้องตอบให้ได้นะ';
                state = 'test1-5';
                status_state = 7;
            }
        }
        else if (anser == 'false') {
            if (pass == 2) {
                state = 'test1-5';
                responsetext = 'ยังไม่ถูกนะ ข้อสุดท้ายต้องตอบให้ได้นะ';
                status_state = 7;
            } else {
                state = 'startgame';
                responsetext = 'ยังไม่ผ่านการทดสอบนะคะ เสียใจด้วย';
                status_state = 0;
            }
        }
        else {
            responsetext = 'การเดินในรูปด้านซ้าย     เกิดจาก    คำสั่งต่างๆ      ในรูปด้านขวา   ใช่หรือไม่';
        }
        console.log('pass ', pass);
    }
    else if (status_state == 7) {
        //5
        if (anser == 'true') {
            pass++;
            if (pass == 3) {
                responsetext = 'เก่งที่สุดเลย ต่อไปต้องเล่นเองแล้วนะ เดินเข้าประตูให้ได้นะจ๊ะ';
                status_state = 8;
                state = 'test2';
            }
        }
        else if (anser == 'false') {
            state = 'startgame';
            responsetext = 'ยังไม่ผ่านการทดสอบนะคะ เสียใจด้วย';
            status_state = 0;
        }
        else {
            responsetext = 'การเดินในรูปด้านซ้าย     เกิดจาก    คำสั่งต่างๆ      ในรูปด้านขวา   ใช่หรือไม่';
        }
        console.log('pass ', pass);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////

    else if (status_state == 8) {
        //test2 forward
        if (tutorial_test == 'start2') {
            console.log('access 8');
            maze = maze_tutorial_test2;
            maze_x = 3;
            maze_y = 1;
            position = [[3, 1]];
            tutorial_test = 'start3';
        }

        if (order != null && distance != null) {
            ComputePosition();
            if (responsetext == 'crashing ,you must modify,delete or insert') {
                responsetext = 'ไม่สามารถไปเส้นทางนี้ได้นะ ให้พูดว่าเริ่มต้นใหม่';
            } else if (responsetext == 'You can not walk the same route, you must modify,delete or insert.') {
                responsetext = 'เดินซ้ำทางเดิมไม่ได้นะ ให้พูดว่าเริ่มต้นใหม่';
            }
            keepArrayOrder();
            if (maze_x == 1 && maze_y == 9) {
                state = 'tutorial_state2';
                responsetext = 'เรียนคำสั่งลบ ถ้าเข้าใจแล้วให้พูดว่าพร้อมแล้ว';
                status_state = 9;
            } else {
                state = null;
            }
        } else if (reset != null) {
            responsetext = 'เริ่มเล่นใหม่อีกครั้งนะ';
            resetArrayOrder();
            resetPosition();
            maze = maze_tutorial_test2;
            maze_x = 3;
            maze_y = 1;
            position = [[3, 1]];
        } else {
            responsetext = 'เดินเข้าประตูโดยใช้คำสั่งที่เรียนมานะ';
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////

    else if (status_state == 9) {
        //tutorial 2 delete
        if (already == 'พร้อมแล้ว') {
            responsetext = 'ต้องเดินเข้าประตูโดยใช้คำสั่งลบ';
            state = 'test3';
            console.log('access tutorial delete ', already);
            status_state = 10;
        } else {
            responsetext = 'ถ้าเข้าใจแล้วให้พูดว่า พร้อมแล้ว';
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////

    else if (status_state == 10) {
        //test3 delete
        if (tutorial_test == 'start3') {
            maze = maze_tutorial_test35;
            maze_x = 11;
            maze_y = 1;
            position = [[11, 1], [11, 3], [11, 5], [9, 5], [7, 5], [7, 7]];
            arrayOrder = [['forward', 2], ['left', 1], ['forward', 2], ['right', 1], ['forward', 1]];
            tutorial_test = 'start4';
        }
        if (delete_flag) {
            state = null;
            deleteCode();
        }
        else if (play_flag) {
            playFunction();
            if (maze_x == 5 && maze_y == 5) {
                state = 'tutorial_state3';
                status_state = 11;
                responsetext = 'เรียนคำสั่งเปลี่ยนต่อเลย ถ้าเข้าใจแล้วให้พูดว่าพร้อมแล้ว';
            } else {
                state = null;
                responsetext = 'ยังไม่ถูกนะให้พูดว่า เริ่มต้นใหม่'
            }
        } else if (reset != null) {
            state = null;
            maze = maze_tutorial_test35;
            position = [[11, 1], [11, 3], [11, 5], [9, 5], [7, 5], [7, 7]];
            arrayOrder = [['forward', 2], ['left', 1], ['forward', 2], ['right', 1], ['forward', 1]];
            responsetext = 'ลบแค่ตัวเดียวก็ได้แล้วนะ สู้ๆ';
        }
        else {
            responsetext = 'ใช้ได้แค่คำสั่งลบนะ';
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    else if (status_state == 11) {
        //tutorial 3 chance
        if (already == 'พร้อมแล้ว') {
            responsetext = 'ต้องใช้คำสั่งเปลี่ยน ทำให้เข้าประตูให้ได้';
            state = 'test4';
            status_state = 12;
        } else {
            responsetext = 'ถ้าเข้าใจแล้วให้พูดว่า พร้อมแล้ว';
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    else if (status_state == 12) {
        //test4  modify
        if (tutorial_test == 'start4') {
            maze = maze_tutorial_test4;
            position = [[11, 5], [9, 5], [7, 5], [5, 5], [5, 3], [5, 1],];
            arrayOrder = [['forward', 3], ['left', 1], ['forward', 2]];
            maze_x = 11;
            maze_y = 5;
            direction = 'N';
            tutorial_test = 'start5';
        }
        if (modify_flag) {
            state = null;
            if (number != null) {
                if (order != null && distance != null) {
                    ComputePosition();
                    keepArrayOrder();
                } else {
                    responsetext = 'จะเปลี่ยนตัวที่' + number + 'เป็นคำสั่งอะไรพูดมาเลย';
                }
            } else {
                responsetext = 'จะเปลี่ยนตัวที่เท่าไหร่คะ';
            }
        }
        else if (play_flag) {
            console.log('play_f ', play_flag);
            playFunction();
            if (maze_x == 5 && maze_y == 9) {
                state = 'tutorial_state4-1';
                status_state = 13;
                responsetext = 'เรียนคำสั่งเพิ่มกันต่อนะคะ';
            } else {
                state = null;
                responsetext = 'ยังไม่ถึงประตูเลย ให้พูดว่า เริ่มต้นใหม่';
            }
        } else if (reset != null) {
            state = null;
            maze = maze_tutorial_test4;
            position = [[11, 5], [9, 5], [7, 5], [5, 5], [5, 3], [5, 1],];
            arrayOrder = [['forward', 3], ['left', 1], ['forward', 2]];
            responsetext = 'ลองใหม่อีกครั้ง เปลี่ยนแค่ตัวเดียวก็ได้แล้ว';
        }
        else {
            responsetext = 'ด่านนี้ต้องใช้คำสั่งแก้ไขนะ';
        }
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////

    else if (status_state == 13) {
        //tutorial 4-1 insert after
        if (already == 'พร้อมแล้ว') {
            responsetext = 'เรียนคำสั่งเพิ่มกันอีกหน่อยนะ';
            state = 'tutorial_state4-2';
            status_state = 14;
        } else {
            responsetext = 'ถ้าเข้าใจแล้วให้พูดว่า พร้อมแล้ว';
        }
    }
    else if (status_state == 14) {
        //tutorial 4-2 insert before
        if (already == 'พร้อมแล้ว') {
            state = 'test5';
            responsetext = 'เข้าประตูให้ได้โดยใช้คำสั่งเพิ่มเท่านั้นนะคะ';
            status_state = 15;
        } else {
            responsetext = 'ถ้าเข้าใจแล้วให้พูดว่า พร้อมแล้ว';
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (status_state == 15) {
        // test 5 insert
        if (tutorial_test == 'start5') {
            maze = maze_tutorial_test35;
            position = [[11, 1], [11, 3], [11, 5], [9, 5], [7, 5], [5, 5]];
            arrayOrder = [['forward', 2], ['left', 1], ['forward', 2], ['forward', 1]];
            maze_x = 11;
            maze_y = 1;
            direction = 'E';
            tutorial_test = null;
        }

        if (insert_flag) {
            state = null;
            if (insert_position != null && number != null) {
                if (order != null && distance != null) {
                    ComputePosition();
                    keepArrayOrder();
                } else {
                    state = null;
                }
            } else {
                responsetext = 'ต้องการเพิ่ม ก่อน หรือ หลัง ตัวไหน';
            }
        }
        else if (play_flag) {
            playFunction();
            if (maze_x == 7 && maze_y == 7) {
                state = 'maze1';
                maze_state = 'maze1';
                status_state = null;
                maze = [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
                [0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]];
                resetPosition();
                resetArrayOrder();
                responsetext = 'ผ่านการทดสอบแล้ว ต่อไปเล่นเองใช้คำสั่งอะไรก็ได้นะ';
            }
            else {
                state = null;
                responsetext = 'ยังไม่ถึงประตูเลย ให้พูดว่า เริ่มต้นใหม่';
            }
        } else if (reset != null) {
            state = null;
            maze = maze_tutorial_test35;
            position = [[11, 1], [11, 3], [11, 5], [9, 5], [7, 5], [5, 5]];
            arrayOrder = [['forward', 2], ['left', 1], ['forward', 2], ['forward', 1]];
            responsetext = 'ลองใหม่อีกครั้ง เพิ่มแค่ตัวเดียวก็ได้แล้ว';
        }
        else {
            responsetext = 'ด่านนี้ต้องใช้คำสั่งเพิ่มนะ';
        }
    }


    console.log('x y ', maze_x, maze_y);

    //HAVE TO DO *****************************************************************************************************
    if (havetoDo_flag == true && delete_flag == true) {
        havetoDo_flag = false;
        console.log('havetoDo_delete ,', havetoDo_flag);
    }
    //function ComputePosition *****************************************************************************************************
    function ComputePosition() {
        console.log('compteposition access');
        if (havetoDo_flag) {
            console.log('havetoDo ,', havetoDo_flag);
            if (modify_flag == true || insert_flag == true || delete_flag == true || reset != null) {
                havetoDo_flag = false;
                console.log('havetoDo ,', havetoDo_flag);
            }
            else {
                responsetext = 'you must use modify group order only.';
            }
            console.log("haveto ", havetoDo_flag);
        }
        if (modify_flag) {
            // console.log('order change is ',order);
            // console.log('distance change is ',distance);
            // console.log('number ',number);
            number = number - 1;
            arrayOrder.splice(number, 1, [order, distance]);

            console.log('arrayOrder from compute mod', arrayOrder);
            number = number + 1;
            // console.log('order change is ',order);
            // console.log('distance change is ',distance);
            // console.log('number ',number);
            // console.log('mo_f ',modify_flag);
            //   }
            // }
        }
        else if (insert_flag) {
            if (insert_position == 'before') {
                number = number - 1;
                arrayOrder.splice(number, 0, [order, distance]);
                console.log('arrayOrder from compute insert before', arrayOrder);
                number = number + 1;
            } else if (insert_position == 'after') {
                arrayOrder.splice(number, 0, [order, distance]);
                console.log('arrayOrder from compute insert after', arrayOrder);
            }

        }
        else if (havetoDo_flag == false || play_flag == true) {
            console.log('order sh in compute', order);
            console.log('disance sh ', distance);
            console.log('in compute sh arr Order ', arrayOrder);
            console.log('x ', maze_x, 'y ', maze_y);
            console.log(maze);
            if (order == "forward") {
                for (var a = 0; a < distance; a++) {
                    if (direction == 'N') {
                        if (maze[maze_x - 1][maze_y] === 0) {
                            maze_x -= 2;
                            position_flag = true
                        }
                        else {
                            position_flag = false
                        }
                    }
                    else if (direction == 'S') {
                        if (maze[maze_x + 1][maze_y] === 0) {
                            maze_x += 2;
                            position_flag = true
                        }
                        else {
                            position_flag = false
                        }
                    }
                    else if (direction == 'W') {
                        if (maze[maze_x][maze_y - 1] === 0) {
                            maze_y -= 2;
                            position_flag = true
                        }
                        else {
                            position_flag = false
                        }
                    }
                    else if (direction == 'E') {
                        if (maze[maze_x][maze_y + 1] === 0) {
                            maze_y += 2;
                            position_flag = true
                        }
                        else {
                            position_flag = false
                        }
                    }
                    if (position_flag) {
                        //check repeat
                        for (var b = 0; b < position.length; b++) {
                            // console.log('x ',maze_x,' y ',maze_y);
                            if (position[b][0] == maze_x && position[b][1] == maze_y) {
                                responsetext = 'You can not walk the same route, you must modify,delete or insert.';
                                console.log(position[b][0], position[b][1]);
                                if (status_state == 8 || status_state == 10 || status_state == 12 || status_state == 15) {
                                    havetoDo_flag = false;
                                }
                                else {
                                    havetoDo_flag = true;
                                }
                                repeat_flag = true;
                                console.log('access check repeat', repeat_flag);
                            }
                        }
                        position.push([maze_x, maze_y]);
                        console.log('position af forward ', position);
                    } else {
                        responsetext = 'crashing ,you must modify,delete or insert';
                        crash_flag = true;
                        if (status_state == 8 || status_state == 10 || status_state == 12 || status_state == 15) {
                            havetoDo_flag = false;
                        }
                        else {
                            havetoDo_flag = true;
                        }
                        console.log('text clashing');
                    }
                    if (responsetext == 'You can not walk the same route, you must modify,delete or insert.') {
                        position.pop();
                        console.log('do function resetposition when repeat');
                    }
                }
                // num = distance * 500;
            }
            else if (order == "backward") {
                for (var c = 0; c < distance; c++) {
                    if (direction == 'N') {
                        if (maze[maze_x + 1][maze_y] === 0) {
                            maze_x += 2;
                            position_flag = true
                        }
                        else {
                            position_flag = false
                        }
                    }
                    else if (direction == 'S') {
                        if (maze[maze_x - 1][maze_y] === 0) {
                            maze_x -= 2;
                            position_flag = true
                        }
                        else {
                            position_flag = false
                        }
                    }
                    else if (direction == 'W') {
                        if (maze[maze_x][maze_y + 1] === 0) {
                            maze_y += 2;
                            position_flag = true
                        }
                        else {
                            position_flag = false
                        }
                    }
                    else if (direction == 'E') {
                        if (maze[maze_x][maze_y - 1] === 0) {
                            maze_y -= 2;
                            position_flag = true
                        }
                        else {
                            position_flag = false
                        }
                    }
                    if (position_flag) {
                        for (var d = 0; d < position.length; d++) {
                            // console.log('x ',maze_x,' y ',maze_y);
                            if (position[d][0] == maze_x && position[d][1] == maze_y) {
                                responsetext = 'You can not walk the same route, you must modify,delete or insert.';
                                console.log(position[d][0], ' ', position[d][1]);
                                repeat_flag = true;
                                if (status_state == 8 || status_state == 10 || status_state == 12 || status_state == 15) {
                                    havetoDo_flag = false;
                                }
                                else {
                                    havetoDo_flag = true;
                                }
                                console.log('access check repeat', repeat_flag);
                            }
                        }
                        position.push([maze_x, maze_y]);
                    } else {
                        crash_flag = true;
                        if (status_state == 8 || status_state == 10 || status_state == 12 || status_state == 15) {
                            havetoDo_flag = false;
                        }
                        else {
                            havetoDo_flag = true;
                        }
                        responsetext = 'crashing ,you must modify,delete or insert';
                        console.log('text clashing');
                    }
                    if (responsetext == 'You can not walk the same route, you must modify,delete or insert.') {
                        position.pop();
                        console.log('do function resetposition when repeat');
                    }
                }
                // num = distance * 500;
            }
            else if (order == "left") {
                for (var e = 0; e < distance; e++) {
                    if (direction == 'E') {
                        direction = 'N';
                    }
                    else if (direction == 'N') {
                        direction = 'W';
                    }
                    else if (direction == 'W') {
                        direction = 'S';
                    }
                    else if (direction == 'S') {
                        direction = 'E';
                    }
                }
                // num = 500;
            }
            else if (order == "right") {
                for (var f = 0; f < distance; f++) {
                    if (direction == 'E') {
                        direction = 'S';
                    }
                    else if (direction == 'S') {
                        direction = 'W';
                    }
                    else if (direction == 'W') {
                        direction = 'N';
                    }
                    else if (direction == 'N') {
                        direction = 'E';
                    }
                }
                // num = 500;
            }
            console.log('in compute sh arr Order ', arrayOrder);
            console.log('position in comp ', position);
            console.log('x ', maze_x, 'y ', maze_y);

        }
        // console.log(direction);
        // console.log(order);
        // console.log(distance);
        console.log("play_falg is ", play_flag);
        console.log(position);
    }

    function keepArrayOrder() {
        console.log('access keepArrayOrder');
        if (modify_flag) {
            console.log('now mo array order is ', arrayOrder);
            console.log('no add array order');
            responsetext = 'say replay for replay your actor';
            // modify_flag = false;
        }
        else if (insert_flag) {
            console.log('now insert array order is ', arrayOrder);
            console.log('no add array order');
            responsetext = 'say replay for replay your actor';
            // insert_flag = false;
        }
        else if (havetoDo_flag == false) {
            if (order == 'forward' || order == 'backward') {
                arrayOrder.push([order, distance]);
                // if(repeat_flag){
                //   console.log('repeating ',repeat_flag);

                //   //resetArrayOrder(); 
                // }
            } else if (order == 'left' || order == 'right') {
                arrayOrder.push([order, distance]);
            }
        }
        // sequence = arrayOrder.length;
        console.log('repeating check in funtion keepArray function ', repeat_flag);
        console.log('arrayOrder ', arrayOrder);
    }

    function deleteCode() {
        console.log('access delete code');
        number_deletecode = number_deletecode - 1;
        arrayOrder.splice(number_deletecode, 1);
        console.log('sh arr Order when delete already', arrayOrder);
        number_deletecode = number_deletecode + 1;
    }

    function playFunction() {
        console.log('access play function');
        position.splice(1, position.length);
        if (status_state == 14) {
            maze_x = 11;
            maze_y = 5;
            direction = 'N';
        }
        else {
            maze_x = 11;
            maze_y = 1;
            direction = 'E';
        }
        if (modify_flag) {
            modify_flag = false;
            number = null;
            console.log('mod-flag in play ', modify_flag);
        }
        else if (insert_flag) {
            insert_flag = false;
            number = null;
            insert_position = null;
            console.log('insert-flag in play ', insert_flag);
        }
        // console.log('mo f ',modify_flag);
        // console.log('in_f '.insert_flag);
        console.log('position from play function ', position);
        console.log('arr order ', arrayOrder);
        for (var j = 0; j < arrayOrder.length; j++) {
            order = arrayOrder[j][0];
            distance = arrayOrder[j][1];
            // console.log('from playfunction');
            ComputePosition();

            // console.log('order play ',order);
            // console.log('distance play ',distance);
        }
        // var turntime = 500 * arrayOrder.length;
        // num = 800 * position.length + turntime;
        order = null;
        distance = null;
        checkState();
        console.log('order play1 ', order);
        console.log('distance play1 ', distance);
        // play_flag = false;

    }

    function resetPosition() {
        console.log('access reset position');
        position.splice(1, position.length);
        console.log('resetPosition ', position);
        maze_x = 11;
        maze_y = 1;
        direction = 'E';
        modify_flag = false;
        insert_flag = false;
        delete_flag = false;
    }

    function resetArrayOrder() {
        console.log('access reset array Order');
        arrayOrder.splice(0, arrayOrder.length);
        console.log('resetOrder ', arrayOrder);
        // order = null;
        // distance = null;
        // sequence = 0;
    }

    //ไม่ต้องย้ายกลับไปจุดเริ่มต้นเพราะ code อยู่ที่เดิม แต่ตำแหน่งเปลี่ยนสรุปว่าจะพูด code ต่อยังไงนะ งง ?
    function checkState() {
        console.log('access checkstate');
        if (state == 'maze1') {
            if (maze_x == 7 && maze_y == 5) {
                responsetext = 'In the stage two';
                state = 'maze2';
                maze_state = 'maze2';
                console.log('position pasent ', position);
                console.log('maze_stste2 ', maze_state);
                // havetoDo_flag = true;
            }
        }
        else if (state == 'maze2') {
            if (maze_x == 7 && maze_y == 3) {
                responsetext = 'In the stage three';
                state = 'maze3';
                maze_state = 'maze3';
                // resetPosition(position);
                console.log('position pasent ', position);
                console.log('maze_stste3 ', maze_state);
                // havetoDo_flag = true;
            }
        }
        else if (state == 'maze3') {
            if (maze_x == 5 && maze_y == 3) {
                responsetext = 'In the stage four';
                state = 'maze4';
                maze_state = 'maze4';
                //  resetPosition(position);
                console.log('position pasent ', position);
                console.log('maze_stste4 ', maze_state);
                // havetoDo_flag = true;
            }
        }
        else if (state == 'maze4') {
            if (maze_x == 5 && maze_y == 5) {
                responsetext = 'In the stage five';
                state = 'maze5';
                maze_state = 'maze5';
                // resetPosition(position);
                console.log('position pasent ', position);
                console.log('maze_stste5 ', maze_state);
                // havetoDo_flag = true;
            }
        }
        else if (state == 'maze5') {
            if (maze_x == 3 && maze_y == 1) {
                responsetext = 'In the stage six';
                state = 'maze6';
                maze_state = 'maze6';
                // resetPosition(position);
                console.log('position pasent ', position);
                console.log('maze_stste6 ', maze_state);
                // havetoDo_flag = true;
            }
        }
        else if (state == 'maze6') {
            if (maze_x == 5 && maze_y == 7) {
                responsetext = 'I keep key already';
            }
            else if (maze_x == 5 && maze_y == 9) {
                if (text == 'key') {
                    responsetext = 'excellent!!';
                    resetPosition(position);
                    //  state = 'Q2';
                    //  var randomtrees = Math.floor(Math.random() * 10) + 1;
                    //  var randomstone = Math.floor(Math.random() * 10) + 1;
                    //  io.emit('Q2',randomtrees,randomstone)
                } else {
                    responsetext = 'You have to keep a key first';
                }
            }
        }
        console.log('responsetext from checkState is ', responsetext);
        // io.emit('state',state);
    }

    // console.log('order global ',order);
    // console.log('distance global ',distance);
    console.log('sh arr Order ', arrayOrder);
    console.log('sh position ', position);

    if (language == 'th') {
        if (responsetext == 'you can choose 1 or 2 only') {
            responsetext = 'เลือกได้เฉพาะเบอร์ 1 หรือ เบอร์ 2 เท่านั้นนะคะ';
        }
        else if (responsetext == 'you must use modify group order only.') {
            responsetext = 'ต้องใช้คำสั่งแก้ไข ลบ หรือ เพิ่ม เท่านั้นนะคะ'
        }
        else if (responsetext == 'You can not walk the same route, you must modify,delete or insert.') {
            responsetext = 'ไม่สามารถเดินชนเส้นทางเดิมได้ ต้องแก้ไขคำสั่งนี้ก่อนถึงจะเดินต่อได้น้า';
        }
        else if (responsetext == 'crashing ,you must modify,delete or insert') {
            responsetext = 'ไม่สามารถไปเส้นทางนี้ได้ ต้องแก้ไขคำสั่งนี้ก่อนถึงจะเดินต่อได้น้า';
        }
        else if (responsetext == 'say replay for replay your actor') {
            responsetext = 'ให้พูดว่า เล่นใหม่';
        }
        else if (responsetext == 'In the stage two') {
            responsetext = 'ผ่านด่าน 1 แล้วไปด่าน 2 ต่อเลย';
        }
        else if (responsetext == 'In the stage three') {
            responsetext = 'ด่าน 3 แล้ว ดูดีๆนะแก้นิดเดียวเอง';
        }
        else if (responsetext == 'In the stage four') {
            responsetext = 'ด่าน 4 แล้ว ระวังนะ เดินทับเส้นทางเดิมไม่ได้นะ';
        }
        else if (responsetext == 'In the stage five') {
            responsetext = 'ไปต่อด่าน 5 เลย';
        }
        else if (responsetext == 'In the stage six') {
            responsetext = 'ด่านสุดท้ายต้องไปเก็บกุญแจก่อนน้า';
        }
        else if (responsetext == 'I keep key already') {
            responsetext = 'เก็บกุญแจได้แล้ว เดินไปหาประตูเลย';
        }
        else if (responsetext == 'you have to keep a key first') {
            responsetext = 'ต้องไปเก็บกุญแจก่อนมาไขประตูนะ';
        }
        else if (responsetext == 'excellent!!') {
            responsetext = 'เก่งมากเลย ทำสำเร็จทุกด่านแล้ว มารับรางวัลนะคะ';
        }
    }

    if (language == 'en' || language == 'en-us') {
        if (responsetext == 'พูดว่า เลี้ยวซ้าย 1 ครั้ง') {
            responsetext = 'Say , turn left 1 time';
        }
        else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เดินหน้า 2 ช่อง') {
            responsetext = 'Still can not speak properly, you have to say forward 2 times';
        }
        else if (responsetext == 'พูดว่า เดินหน้า 1 ช่อง') {
            responsetext = 'Say , forward 1 time';
        }
        else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เลี้ยวซ้าย 1 ครั้ง') {
            responsetext = 'Still can not speak properly, you have to say turn left 1 time';
        }
        else if (responsetext == 'พูดว่า เลี้ยวขวา 2 ครั้ง') {
            responsetext = 'Say , turn right 2 times';
        }
        else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เดินหน้า 1 ช่อง') {
            responsetext = 'Still can not speak properly, you have to say go to forward 1 time';
        }
        else if (responsetext == 'ทีนี้ ลองดูซิว่าจะเกิดอะไรขึ้น เมื่อเดินทับเส้นทางเดิม ให้พูดคำว่าเดินหน้า') {
            responsetext = "Let's see what happens , when walking the same path , To say forward";
        }
        else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เลี้ยวขวา 2 ครั้ง') {
            responsetext = "Still can't speak properly, you have to say turn right 2 times";
        }
        else if (responsetext == 'ไม่สามารถเดินทับเส้นทางเดิมได้ ขอให้แก้ไขคำสั่งโดยพูดว่าแก้ไขบรรทัดที่5') {
            responsetext = "Can't walk over the same path, please edit the commands , you can say edit line number 5";
        }
        else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เดินหน้า') {
            responsetext = "Still can't speak properly, you have to say  forward";
        }
        else if (responsetext == 'พูดสิ่งที่ต้องการเปลี่ยนในบรรทัดที่ 5 มาเลย ให้พูดว่า ถอยหลัง 1 ช่อง') {
            responsetext = "You can say , what do you want to edit commands  in line number 5 . Say backward 1 time";
        }
        else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า แก้ไขบรรทัดที่ 5') {
            responsetext = "Still can't speak properly, you have to say edit line number 5";
        }
        else if (responsetext == 'ทีนี้ ลองให้ทำงานตามคำสั่งใหม่ทั้งหมดอีกครั้ง พูดว่า เล่นใหม่') {
            responsetext = "Try to work all new commands again. You have to say replay";
        }
        else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า ถอยหลัง 1 ช่อง') {
            responsetext = "Still can't speak properly, you have to say backward 1 time";
        }
        else if (responsetext == 'ยินดีด้วยจบด่าน1แล้ว ทีนี้มาเล่นด่านที่2 สังเกตคำสั่งว่าตัวละครเดินมา 2 ช่องแล้ว ต่อไปให้พูดว่าเลี้ยวซ้าย') {
            responsetext = "Congratulations to the end of Stage 1.Come to play Stage 2 and Observe the commands that the characters walked in 2 times. Next , you can say turn left";
        }
        else if (responsetext == 'ต่อไปพูดว่าเดินหน้า แล้วสังเกตุว่าเกิดอะไรขึ้น') {
            responsetext = "Next, you say forward .Let's see what happens?";
        }
        else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เลี้ยวซ้าย') {
            responsetext = "Still can't speak properly, you have to say turn left";
        }
        else if (responsetext == 'ไม่สามารถเดินไปเส้นทางนี้ได้ ต้องแก้ไขคำสั่งนี้ก่อนให้พูดว่า เพิ่มหลังบรรทัดที่1') {
            responsetext = "Can not walk this route , you have to edit this command , say insert after line 1";
        }
        else if (responsetext == 'พูดคำสั่งที่ต้องการเพิ่มหลังบรรทัดที่ 1 มาเลย ให้พูดว่า เดินหน้า') {
            responsetext = "You can say , what do you want to insert commands  after  line number 1 . Say forward 1 time";
        }
        else if (responsetext == 'ต้องพูดว่า เพิ่มหลังบรรทัดที่1นะ') {
            responsetext = "Still can't speak properly, you have to say insert after line 1";
        }
        else if (responsetext == 'เปลี่ยนด่านใหม่เดินมาใกล้ประตูแล้ว จะเดินเข้าประตูต้องพูดว่า ถอยหลัง 1 ช่องนะ') {
            responsetext = "Change to stage 3 ,then you near the door. To walk into the door, say back 1 time";
        }
        else if (responsetext == 'ผ่านด่านมาแล้ว  ไม่สามารถเดินทับเส้นทางเดิมได้  ฉะนั้นด่านต่อไป ต้องพูดว่า ลบบรรทัดที่ 5') {
            responsetext = "Passed the stage 3 .Can not walk the same path , then you have to say delete line 5";
        }
        else if (responsetext == 'วิธีที่ง่ายที่สุดที่จะเดินเข้าประตูคือ ถอยหลัง 1 ช่องนะ') {
            responsetext = "The best way to walk into the door is back 1 time";
        }
        else if (responsetext == 'แค่ลบบรรทัดที่ 5 ทิ้งก็เข้าประตูได้แล้วนะ') {
            responsetext = "Just delete number 5";
        }
        else if (responsetext == 'เรียนจบแล้วต่อไปเป็นการทดสอบน้า เดินเข้าประตูให้ครบ 6 ด่านนะจ๊ะ') {
            responsetext = "Passed the test , Next walk into the door to complete 6 stage";
        }
        else if (responsetext == 'ต้องพูดว่าเล่นใหม่ก่อนนะ') {
            responsetext = 'Have to say replay first';
        }
        else if (responsetext == 'ถ้าจะให้ถูกต้องต้องพูดว่า เดินหน้า 1 ช่องนะคะ') {
            responsetext = 'If it is correct, I must say forward 1 time';
        }
    }



    console.log('resq is ', responsetext);

    //send response
    let responseObj = {
        "fulfillmentText": responsetext,
    }

    console.log('show responseObj is ', responseObj);



    console.log('lan ', language);
    console.log('order final ', order, ' distance final ', distance);
    console.log('number of code modify', number);
    console.log('position insert ', insertPosition);
    console.log('state ', state);
    console.log('have to do ', havetoDo_flag);
    console.log('maze_state ', maze_state);
    console.log('x final ', maze_x, ' y final ', maze_y);
    // console.log('seq ',sequence);
    // console.log('repeat_f ',repeat_flag);
    console.log("playF ", play_flag);
    io.emit('chat', order, distance, insert_flag, modify_flag, number, insert_position, delete_flag, play_flag, state, startgame, character, reset_flag, number_deletecode, anser, maze_state, godmode);
    io.emit('symbols', order, distance, state, reset_flag, modify_flag, insert_flag, delete_flag, number, number_deletecode, play_flag, insert_position, repeat_flag, crash_flag, maze_state, anser, godmode);
    order = null;
    distance = null;
    anser = null;
    startgame = null;
    character = null;
    test_flag = false;
    delete_flag = false;
    godmode = null;
    play_flag = false;
    maze_state = null;
    number_deletecode = null;
    reset_flag = false;
    repeat_flag = false;
    crash_flag = false;

    // if (status_state == 15) {
    //     modify_flag = false;
    //     number = null;
    // } else if (status_state == null) {
    //     insert_flag = false;
    //     insert_position = null;
    //     number = null;
    // }

    // reset = null
    // var num = distance*1000;
    setTimeout(function () {
        console.log('send already');
        return res.json(responseObj);
    })
    // console.log('num ', num);
    // num = 500;
    // console.log('num ', num);

})

// received messages from scratchX game control 
io.on('connection', function (socket) {
    var responsetext1;
    console.log('connect');
    socket.on('resend', function (remessage) {
        if (remessage.hasOwnProperty('name')) {
            responsetext1 = remessage.name;
        } else if (remessage.hasOwnProperty('question2')) {
            responsetext1 = remessage.question2;
        } else if (remessage.hasOwnProperty('stateOfMaze')) {
            responsetext1 = remessage.stateOfMaze;
        }
        console.log('resendtext is ', responsetext1);
        text = responsetext1;
    });
});

io.on('connect_error', function (data) {
    console.log(data);
});

http.listen(port, function () {
    console.log('listening on *: ' + port);
});

// สร่าง block เดินหน้า 3 เลี้ยวขวา แทนเป็น A ทำ A 4 ครั้ง  ต่อไป ทำ A โดยลดระยะลง 1 ทุกครั้ง ทำซ้อน block ซ้อน block

