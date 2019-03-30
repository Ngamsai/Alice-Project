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
//var pass = 0;
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
//var test_flag = false;
var maze_state = null;
var num = 500;
var ee = 3;
//var already = null;
//var already_flag = false;
var anser = null;
//var test_state = null;
var order = null, distance = null, forward_backward_direction = null, left_right_direction = null, direction_return = null;
var modify = null, delete_code = null, insert = null, play = null, reset = null, numberSequence = null, insertPosition = null, number = null, insert_position = null;
var number_deletecode = null;
var startgame = null, language;
var tutorial_start = 'teach1';
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
    //test_state = keep.test;
    character = keep.actor;
    // tutorial_state = keep.state;
    // tutorial_num_state = keep['num-state']
    godmode = keep.godmode;
    state_godmode = keep.state;
    reset = keep.reset;
    modify = keep.modify;
    // already = keep.already;
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
        order = 'right';
        console.log('show return ', order, 'distance ', distance);
    }
    /////////////////////////////////////////////ggggggggoooooooddddd------mmmmmooooddddddddeeeee/////////////////////
    if (godmode != null && state_godmode != null) {
        status_state = state_godmode;
        pass = 0;
        console.log('godmode ', godmode, 'state ', status_state);
        if (status_state == 2) {
            state = 'teach1';
            tutorial_start = 'teach1';
        }
        else if (status_state == 3) {
            state = 'test1';
            tutorial_start = 'test1';
        }
        else if (status_state == 4) {
            state = 'teach2';
            tutorial_start = 'teach2';
        }
        else if (status_state == 5) {
            state = 'test2';
            tutorial_start = 'test2';
        }
        else if (status_state == 6) {
            state = 'teach3';
            tutorial_start = 'teach3';
        }
        else if (status_state == 7) {
            state = 'test3';
            tutorial_start = 'test3';
        }
        else if (status_state == 8) {
            tutorial_start = 'test4-1';
            state = 'teach4-1';
        }
        else if (status_state == 9) {
            state = 'teach4-2';
            tutorial_start = 'teach4-2';
        }
        else if (status_state == 10) {
            tutorial_start = 'test4';
            state = 'test4';
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
        //pass = 0;
        state = 'startgame';
        tutorial_start = 'teach1';
        ee = 3;
        havetoDo_flag = false;
        position_flag = true;
        modify_flag = false;
        insert_flag = false;
        repeat_flag = false;
        crash_flag = false;
        number = null;
        number_deletecode = null;
        insert_position = null;
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
                state = 'teach1';
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
        if (status_state == 4) {
            console.log('tutorial_state4_play_flag ', play_flag);
        }else if (status_state == 5) {
            console.log('tutorial_state5_play_flag ', play_flag);
        } else if (status_state == 6) {
            modify_flag = false;
            number = null;
            console.log('tutorial_state6_play_flag ', play_flag);
        } else if (status_state == 7) {
            modify_flag = false;
            number = null;
            console.log('tutorial_state7_play_flag ', play_flag);
        } else if (status_state == 8) {
            insert_flag = false;
            insert_position = null;
            number = null;
            console.log('tutorial_state8_play_flag ', play_flag);
        } else if (status_state == 9) {
            insert_flag = false;
            insert_position = null;
            number = null;
            console.log('tutorial_state9_play_flag ', play_flag);
        } else if (status_state == 10) {
            insert_flag = false;
            insert_position = null;
            number = null;
            console.log('tutorial_state10_play_flag ', play_flag);
        } else {
            playFunction();
        }
    }
    // else if (test_state != null) {
    //     test_flag = true;
    // }
    // else if (anser != null) {
    //     console.log('anser is ', anser);
    // }
    // else if (already != null) {
    //     already_flag = true;
    //     console.log('tutorial already ', already);
    // }


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
        if (status_state >= 2 && status_state <= 10) {
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
                responsetext = 'ไม่สามารถใช้คำสั่งเริ่มต้นใหม่แล้วนะ';
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
        if (status_state >= 2 && status_state <= 10)  {
            console.log('go to state tu');
        }
        // else if (status_state == 10) {
        //     console.log('got to state 10');
        // }
        // else if (status_state == 12) {
        //     console.log('go to state 12');
        // }
        // else if (status_state == 15) {
        //     console.log('go to state 15');
        // }
        else {
            console.log('sh order', order, 'show distance ', distance);
            ComputePosition();
            keepArrayOrder();
            checkState();
        }

    }

    console.log('status_state ', status_state);

    var maze_tutorial_test24 =
        [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
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

    var test1 =
        [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]];

    var teach1 =
        [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
        [0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]];

    var teach2 =
        [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
        [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1],
        [0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]];

    var teach3 =
        [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
        [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]];

    var teach4 =
        [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
        [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1],
        [0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]];

    var maze_tutorial_test3 =
        [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
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
        //teach 1
        if (tutorial_start == 'teach1') {
            console.log('access teach1');
            maze = teach1;
            maze_x = 3;
            maze_y = 1;
            position = [[3, 1]];
            tutorial_start = 'test1';
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
                state = 'test1';
                responsetext = 'ต่อไปเป็นการทดสอบให้น้องลองเล่นเอง';
                status_state = 3;
            } else {
                state = null;
            }
        } else if (reset != null) {
            responsetext = 'เริ่มเล่นใหม่อีกครั้งนะ';
            resetArrayOrder();
            resetPosition();
            maze = teach1;
            maze_x = 3;
            maze_y = 1;
            position = [[3, 1]];
        } else {
            responsetext = 'ต้องเดินเข้าประตูให้ได้นะ';
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////

    else if (status_state == 3) {
        //test1 forward
        if (tutorial_start == 'test1') {
            console.log('access test1');
            maze = test1;
            maze_x = 3;
            maze_y = 1;
            position = [[3, 1]];
            tutorial_start = 'start3';
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
                state = 'teach2';
                responsetext = 'ไปดูตัวอย่างการใช้คำสั่งลบต่อเลย';
                status_state = 4;
            } else {
                state = null;
            }
        } else if (reset != null) {
            responsetext = 'เริ่มเล่นใหม่อีกครั้งนะ';
            resetArrayOrder();
            resetPosition();
            maze = test1;
            position = [[3, 1]];
        } else {
            responsetext = 'เดินเข้าประตูโดยใช้คำสั่งที่เรียนมานะ';
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    else if (status_state == 4) {
        //teach2 delete
        num = 7000;
        if (tutorial_start == 'teach2') {
            maze = teach2;
            maze_x = 5;
            maze_y = 1;
            position = [[5, 1], [5, 3], [5, 5], [3, 5], [1, 5]];
            arrayOrder = [['forward', 2], ['left', 1], ['forward', 2]];
            tutorial_start = 'test2';
        }
        if (delete_flag) {
            state = null;
            deleteCode();
        }
        else if (play_flag) {
            playFunction();
            if (maze_x == 5 && maze_y == 9) {
                state = 'test2';
                status_state = 5;
                num = 7000;
                responsetext = 'ต่อไปให้น้องทดสอบดูว่าเข้าใจรึยัง';
            } else {
                state = null;
                responsetext = 'ยังไม่ถูกนะให้พูดว่า เริ่มต้นใหม่';
            }
        } else if (reset != null) {
            state = null;
            maze = teach2;
            maze_x = 5;
            maze_y = 1;
            position = [[5, 1], [5, 3], [5, 5], [3, 5], [1, 5]];
            arrayOrder = [['forward', 2], ['left', 1], ['forward', 2]];
            responsetext = 'ลบแค่ตัวเดียวก็ได้แล้วนะ สู้ๆ';
        }
        else {
            responsetext = 'ใช้ได้แค่คำสั่งลบนะ';
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    else if (status_state == 5) {
        //test2 delete
        num = 7000;
        if (tutorial_start == 'test2') {
            maze = maze_tutorial_test24;
            maze_x = 11;
            maze_y = 1;
            position = [[11, 1], [11, 3], [11, 5], [9, 5], [7, 5], [7, 7]];
            arrayOrder = [['forward', 2], ['left', 1], ['forward', 2], ['right', 1], ['forward', 1]];
            tutorial_start = 'teach3';
        }
        if (delete_flag) {
            state = null;
            deleteCode();
        }
        else if (play_flag) {
            playFunction();
            if (maze_x == 5 && maze_y == 5) {
                state = 'teach3';
                status_state = 6;
                num = 7000;
                responsetext = 'เก่งมากเลย เรียนการใช้คำสั่งเปลี่ยนต่อเลย';
            } else {
                state = null;
                responsetext = 'ยังไม่ถูกนะให้พูดว่า เริ่มต้นใหม่';
            }
        } else if (reset != null) {
            state = null;
            maze = maze_tutorial_test24;
            position = [[11, 1], [11, 3], [11, 5], [9, 5], [7, 5], [7, 7]];
            arrayOrder = [['forward', 2], ['left', 1], ['forward', 2], ['right', 1], ['forward', 1]];
            responsetext = 'ลบแค่ตัวเดียวก็ได้แล้วนะ สู้ๆ';
        }
        else {
            responsetext = 'ใช้ได้แค่คำสั่งลบนะ';
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    else if (status_state == 6) {
        //teach3  modify
        if (tutorial_start == 'teach3') {
            maze = teach3;
            position = [[5, 1], [5, 3], [5, 5], [3, 5]];
            arrayOrder = [['forward', 2], ['left', 1], ['forward', 1]];
            maze_x = 5;
            maze_y = 1;
            tutorial_start = 'test3';
        }
        if (modify_flag) {
            state = null;
            if (number != null) {
                if (order != null && distance != null) {
                    ComputePosition();
                    keepArrayOrder();
                } else {
                    console.log('mod ', modify_flag, 'num ', number);
                }
            } else {
                console.log('mod ', modify_flag);
            }
        }
        else if (play_flag) {
            console.log('play_f ', play_flag);
            playFunction();
            if (maze_x == 3 && maze_y == 9) {
                state = 'test3';
                status_state = 7;
                num = 6000;
                responsetext = 'ทดสอบดูสิเข้าใจรึยัง';
            } else {
                state = null;
                responsetext = 'ยังไม่ถึงประตูเลย ให้พูดว่า เริ่มต้นใหม่';
            }
        } else if (reset != null) {
            state = null;
            maze = teach3;
            position = [[5, 1], [5, 3], [5, 5], [3, 5]];
            arrayOrder = [['forward', 2], ['left', 1], ['forward', 1]];
            responsetext = 'ลองใหม่อีกครั้ง เปลี่ยนแค่ตัวเดียวก็ได้แล้ว';
        }
        else {
            responsetext = 'ด่านนี้ต้องใช้คำสั่งแก้ไขนะ';
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    else if (status_state == 7) {
        //test3  modify
        if (tutorial_start == 'test3') {
            maze = maze_tutorial_test3;
            position = [[11, 5], [9, 5], [7, 5], [5, 5], [5, 3], [5, 1],];
            arrayOrder = [['forward', 3], ['left', 1], ['forward', 2]];
            maze_x = 11;
            maze_y = 5;
            direction = 'N';
            tutorial_start = 'teach4-1';
        }
        if (modify_flag) {
            state = null;
            if (number != null) {
                if (order != null && distance != null) {
                    ComputePosition();
                    keepArrayOrder();
                } else {
                    console.log('mod ', modify_flag, 'num ', number);
                }
            } else {
                console.log('mod ', modify_flag);
            }
        }
        else if (play_flag) {
            console.log('play_f ', play_flag);
            playFunction();
            if (maze_x == 5 && maze_y == 9) {
                state = 'teach4-1';
                status_state = 8;
                num = 6000;
                responsetext = 'ทำถูกแล้วคะ  เรียนคำสั่งสุดท้ายเลย';
            } else {
                state = null;
                responsetext = 'ยังไม่ถึงประตูเลย ให้พูดว่า เริ่มต้นใหม่';
            }
        } else if (reset != null) {
            state = null;
            maze = maze_tutorial_test3;
            position = [[11, 5], [9, 5], [7, 5], [5, 5], [5, 3], [5, 1],];
            arrayOrder = [['forward', 3], ['left', 1], ['forward', 2]];
            responsetext = 'ลองใหม่อีกครั้ง เปลี่ยนแค่ตัวเดียวก็ได้แล้ว';
        }
        else {
            responsetext = 'ด่านนี้ต้องใช้คำสั่งแก้ไขนะ';
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (status_state == 8) {
        // teach 4-1 insert after
        if (tutorial_start == 'teach4-1') {
            maze = teach4;
            position = [[5, 1], [5, 3], [5, 5], [5, 7], [5, 9]];
            arrayOrder = [['forward', 2], ['forward', 2]];
            maze_x = 5;
            maze_y = 1;
            direction = 'E';
            tutorial_start = 'teach4-2';
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
                console.log('insert ', insert_flag);
            }
        }
        else if (play_flag) {
            playFunction();
            if (maze_x == 1 && maze_y == 5) {
                state = 'teach4-2';
                status_state = 9;
                responsetext = 'คำสั่งนี้มีอีก 1 วิธีที่พูดได้นะ';
            }
            else {
                state = null;
                responsetext = 'ยังไม่ถึงประตูเลย ให้พูดว่า เริ่มต้นใหม่';
            }
        } else if (reset != null) {
            state = null;
            maze = teach4;
            position = [[5, 1], [5, 3], [5, 5], [5, 7], [5, 9]];
            arrayOrder = [['forward', 2], ['forward', 2]];
            responsetext = 'ลองใหม่อีกครั้ง เพิ่มแค่ตัวเดียวก็ได้แล้ว';
        }
        else {
            responsetext = 'ด่านนี้ต้องใช้คำสั่งเพิ่มนะ';
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (status_state == 9) {
        // teach 4-2 insert before
        if (tutorial_start == 'teach4-2') {
            maze = teach4;
            position = [[5, 1], [5, 3], [5, 5], [5, 7], [5, 9]];
            arrayOrder = [['forward', 2], ['forward', 2]];
            maze_x = 5;
            maze_y = 1;
            direction = 'E';
            tutorial_start = 'test4';
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
                console.log('insert ', insert_flag);
            }
        }
        else if (play_flag) {
            playFunction();
            if (maze_x == 1 && maze_y == 5) {
                state = 'test4';
                status_state = 10;
                responsetext = 'ลองให้น้องทดสอบดูสิ';
            }
            else {
                state = null;
                responsetext = 'ยังไม่ถึงประตูเลย ให้พูดว่า เริ่มต้นใหม่';
            }
        } else if (reset != null) {
            state = null;
            maze = teach4;
            position = [[5, 1], [5, 3], [5, 5], [5, 7], [5, 9]];
            arrayOrder = [['forward', 2], ['forward', 2]];
            responsetext = 'ลองใหม่อีกครั้ง เพิ่มแค่ตัวเดียวก็ได้แล้ว';
        }
        else {
            responsetext = 'ด่านนี้ต้องใช้คำสั่งเพิ่มนะ';
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (status_state == 10) {
        // test 4 insert

        if (tutorial_start == 'test4') {
            maze = maze_tutorial_test24;
            position = [[11, 1], [11, 3], [11, 5], [9, 5], [7, 5], [5, 5]];
            arrayOrder = [['forward', 2], ['left', 1], ['forward', 2], ['forward', 1]];
            maze_x = 11;
            maze_y = 1;
            direction = 'E';
            tutorial_start = null;
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
                console.log('insert ', insert_flag);
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
            maze = maze_tutorial_test24;
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
                num = distance * 1000;
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
                num = distance * 1000;
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
                num = 1000;
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
                num = 1000;
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
        if (status_state == 12) {
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
        //var turntime = 1000 * arrayOrder.length;
        num = 1000 * position.length;
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
        else if (responsetext == 'Sorry, could you say that again?') {
            responsetext = 'ขอโทษค่ะ ลองพูดอีกครั้งได้ไหมคะ';
        }
    }

    if (language == 'en' || language == 'en-us') {
        if (responsetext == 'ต้องใช้คำสั่งที่เรียนมาเดินเข้าประตูให้ได้นะ') {
            responsetext = 'Next walk into the door';
        }
        else if (responsetext == 'ด่าน 2 แล้วนะ') {
            responsetext = 'maze 2';
        }
        else if (responsetext == 'ด่าน 3 แล้วนะ') {
            responsetext = 'maze 3';
        }
        else if (responsetext == 'ด่าน 4 แล้วนะ') {
            responsetext = 'maze 4';
        }
        else if (responsetext == 'ด่าน 5 แล้วนะ') {
            responsetext = 'maze 5';
        }
        else if (responsetext == 'ด่าน 6 แล้วนะ') {
            responsetext = 'maze 6';
        }
        else if (responsetext == 'เหลือหัวใจแค่ 1 ดวงแล้วนะ') {
            responsetext = "Only 1 heart left.";
        }
        else if (responsetext == 'หัวใจหมดแล้วนะ ใช้คำสั่งเริ่มต้นใหม่ไม่ได้แล้วนะ') {
            responsetext = "Heart is gone Can't use reset.";
        }
        else if (responsetext == 'ไม่สามารถใช้คำสั่งเริ่มต้นใหม่แล้วนะ') {
            responsetext = "Can't use reset.";
        }
        else if (responsetext == 'ขอโทษค่ะ ฉันไม่เข้าใจ') {
            responsetext = "Sorry I don't understand";
        }
        else if (responsetext == 'ตั้งใจฟังนะ การเดินในรูปด้านซ้าย     เกิดจาก    คำสั่งต่างๆ      ในรูปด้านขวา   ใช่หรือไม่') {
            responsetext = "Listen carefully. Is walking in the left image caused by orders in the picture on the right?";
        }
        else if (responsetext == 'พูดว่าทดสอบ ก่อนนะ') {
            responsetext = "Please say, test first";
        }
        else if (responsetext == 'เก่งมากเลย ทำอีกข้อนะ') {
            responsetext = "Very good at doing it again";
        }
        else if (responsetext == 'ยังไม่ถูกนะลองทำข้อใหม่ดูอีกทีนะ') {
            responsetext = "Still incorrect. Try to do next.";
        }
        else if (responsetext == 'การเดินในรูปด้านซ้าย     เกิดจาก    คำสั่งต่างๆ      ในรูปด้านขวา    ใช่หรือไม่') {
            responsetext = "Is walking in the left image caused by orders in the picture on the right?";
        }
        else if (responsetext == 'เก่งมากเลย ไปข้อต่อไปเลย') {
            responsetext = "Very good next";
        }
        else if (responsetext == 'ถ้ายังทำข้อต่อไปไม่ได้จะไม่ผ่านการทดสอบนะ') {
            responsetext = "If the next step is not correct, it will not pass the test.";
        }
        else if (responsetext == 'ไม่ถูกนะข้อต่อไปดูดีดีนะ') {
            responsetext = "Still incorrect. Try to do next.";
        }
        else if (responsetext == 'เก่งที่สุดเลย ต่อไปต้องเล่นเองแล้วนะ เดินเข้าประตูให้ได้นะจ๊ะ') {
            responsetext = "good job next walk into the door";
        }
        else if (responsetext == 'ยังไม่ผ่านการทดสอบนะคะ เสียใจด้วย') {
            responsetext = "Don't pass the test.";
        }
        else if (responsetext == 'ยังไม่ถูกนะคะ ไปข้อต่อไปเลย') {
            responsetext = "Still incorrect. Try to do next.";
        }
        else if (responsetext == 'เก่งมากเลย ข้อสุดท้ายต้องตอบให้ได้นะ') {
            responsetext = "Very good next";
        }
        else if (responsetext == 'ยังไม่ถูกนะ ข้อสุดท้ายต้องตอบให้ได้นะ') {
            responsetext = "Still incorrect Finally, you must answer correctly.";
        }
        else if (responsetext == 'ไม่สามารถไปเส้นทางนี้ได้นะ ให้พูดว่าเริ่มต้นใหม่') {
            responsetext = "Can't go this route To say reset";
        }
        else if (responsetext == 'เดินซ้ำทางเดิมไม่ได้นะ ให้พูดว่าเริ่มต้นใหม่') {
            responsetext = "Can't repeat the same path To say reset";
        }
        else if (responsetext == 'เรียนคำสั่งลบ ถ้าเข้าใจแล้วให้พูดว่าพร้อมแล้ว') {
            responsetext = 'Learn how to use the delete order. If you understand, say ready.';
        }
        else if (responsetext == 'เริ่มเล่นใหม่อีกครั้งนะ') {
            responsetext = 'Start replaying again';
        }
        else if (responsetext == 'เดินเข้าประตูโดยใช้คำสั่งที่เรียนมานะ') {
            responsetext = 'Walked into the door';
        }
        else if (responsetext == 'ต้องเดินเข้าประตูโดยใช้คำสั่งลบ') {
            responsetext = 'Must walk into the door using the delete command';
        }
        else if (responsetext == 'ถ้าเข้าใจแล้วให้พูดว่า พร้อมแล้ว') {
            responsetext = 'If you understand, say ready.';
        }
        else if (responsetext == 'เรียนคำสั่งเปลี่ยนต่อเลย ถ้าเข้าใจแล้วให้พูดว่าพร้อมแล้ว') {
            responsetext = 'Continue to learn change orders If you understand, say ready.';
        }
        else if (responsetext == 'ยังไม่ถูกนะให้พูดว่า เริ่มต้นใหม่') {
            responsetext = 'It is still incorrect to say reset';
        }
        else if (responsetext == 'ลบแค่ตัวเดียวก็ได้แล้วนะ สู้ๆ') {
            responsetext = 'delete only one';
        }
        else if (responsetext == 'ใช้ได้แค่คำสั่งลบนะ') {
            responsetext = 'Can only use delete commands';
        }
        else if (responsetext == 'ต้องใช้คำสั่งเปลี่ยน ทำให้เข้าประตูให้ได้') {
            responsetext = 'Must use the change command Can make it into the door';
        }
        else if (responsetext == 'เรียนคำสั่งเพิ่มกันต่อนะคะ') {
            responsetext = 'Learn add commands';
        }
        else if (responsetext == 'ยังไม่ถึงประตูเลย ให้พูดว่า เริ่มต้นใหม่') {
            responsetext = 'replay please say reset';
        }
        else if (responsetext == 'ลองใหม่อีกครั้ง เปลี่ยนแค่ตัวเดียวก็ได้แล้ว') {
            responsetext = 'Try again Can change only one';
        }
        else if (responsetext == 'ด่านนี้ต้องใช้คำสั่งแก้ไขนะ') {
            responsetext = 'This stage requires change commands.';
        }
        else if (responsetext == 'เรียนคำสั่งเพิ่มกันอีกหน่อยนะ') {
            responsetext = 'Learn add commands';
        }
        else if (responsetext == 'เข้าประตูให้ได้โดยใช้คำสั่งเพิ่มเท่านั้นนะคะ') {
            responsetext = 'Can enter the door using only add order';
        }
        else if (responsetext == 'ผ่านการทดสอบแล้ว ต่อไปเล่นเองใช้คำสั่งอะไรก็ได้นะ') {
            responsetext = 'Congratulations for passing the test Continue to play game';
        }
        else if (responsetext == 'ลองใหม่อีกครั้ง เพิ่มแค่ตัวเดียวก็ได้แล้ว') {
            responsetext = 'Try again Can only add one';
        }
        else if (responsetext == 'ด่านนี้ต้องใช้คำสั่งเพิ่มนะ') {
            responsetext = 'This stage requires add commands.';
        }
        else if (responsetext == 'เรียนคำสั่งเพิ่มกันอีกหน่อยนะ') {
            responsetext = 'Learn add commands';
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
    already_flag = false;
    play_flag = false;
    maze_state = null;
    number_deletecode = null;
    reset_flag = false;
    repeat_flag = false;
    crash_flag = false;


    // var num = distance*1000;
    setTimeout(function () {
        console.log('send already');
        return res.json(responseObj);
    }, num)
    console.log('num ', num);
    num = 500;

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

