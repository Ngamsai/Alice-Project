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
var already = null;
var anser = null;
var test_state = null;
var order = null, distance = null, forward_backward_direction = null, left_right_direction = null, direction_return = null;
var modify = null, delete_code = null, insert = null, play = null, reset = null, numberSequence = null, insertPosition = null, number = null, insert_position = null;
var number_deletecode = null;
var startgame = null, language;
// var tutorial_num_state = null;
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
    // console.log(req.body);
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
        console.log('show return ', direction_return);
        order = 'right';
    }

    if( godmode != null && state_godmode != null){
        status_state = state_godmode;
    }
    //show value
    if (req.body.queryResult.action == 'input.welcome') {
        status_state = 0;
        state = 'startgame';
        havetoDo_flag = false;
        resetPosition();
        resetArrayOrder();
        console.log('all position when restart', position);
        console.log('array of order when restart', arrayOrder);
    }
    else if (startgame != null && status_state == 0) {
        status_state = 1;
        console.log('show start ', startgame);
        // console.log('Do is ',havetoDo_flag);
    }
    else if (character != null) {
        if (status_state == 1) {
            console.log('actor is ', character);
            if (character == "1" || character == "2") {
                console.log('character is ', character);
                state = 'select character';
                status_state = 2.1;
                responsetext = 'มาเรียนกันก่อนนะ   ตั้งใจฟังที่พี่อลิซบอกนะคะ  ถ้าพร้อมแล้วให้พูดว่า   พร้อมแล้ว';
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
        } else if (status_state == 14) {
            console.log('tutorial_state14_play_flag ', play_flag);
        } else if (status_state == 18) {
            console.log('tutorial_state18_play_flag ', play_flag);
        } else if (status_state == 22) {
            console.log('tutorial_state22_play_flag ', play_flag);
        } else if (status_state == 24) {
            console.log('tutorial_state24_play_flag ', play_flag);
        } else if (status_state == 27) {
            console.log('tutorial_state27_play_flag ', play_flag);
        } else if (status_state == 31) {
            playFunction();
        } else {
            play_flag = false;
        }
        // console.log('numberSequence ',numberSequence); 
    }
    else if (test_state != null) {
        if (status_state == 5 && test_state == 'ทดสอบ') {
            console.log('test5 ', test_state);
            test_flag = true;
        } else if (status_state == 11 && test_state == 'ทดสอบ') {
            console.log('test11 ', test_state);
            test_flag = true;
        } else if (status_state == 19 && test_state == 'ทดสอบ') {
            console.log('test19 ', test_state);
            test_flag = true;
        } else if (status_state == 25 && test_state == 'ทดสอบ') {
            console.log('test25 ', test_state);
            test_flag = true;
        } else {
            test_flag = false;
        }
    }
    else if (anser != null) {
        if (anser == 'ถูก') {
            anser = 'correct';
        } else if (anser == 'ไม่ถูก') {
            anser = 'incorrect';
        }
        if (status_state == 28) {
            console.log('state28 anser is ', anser);
        } else if (status_state == 29) {
            console.log('state29 anser is ', anser);
        }
    }
    else if (already != null) {
        if (status_state == 2) {
            console.log('start tutorial mode');
        }
        else if (status_state == 7) {
            console.log('tutorial modify already');
        }
        else if (status_state == 15) {
            console.log('tutorial insert already');
        }
    }

    
    if (modify != null) {
        modify_flag = true;
        number = numberSequence;
        if (status_state == 8) {
            console.log('tutorial_state8_mod_flag ', modify_flag, ' num ', number);
        } else if (status_state == 12) {
            console.log('tutorial_state12_mod_flag ', modify_flag, ' num ', number);
        } else if (status_state == 31) {
            console.log('state31_mod_flag ', modify_flag);
            console.log(' num_modify ', number);
        } else {
            modify_flag = false;
        }
        console.log('he will ', modify, 'status-mod ', modify_flag, ' in number ', numberSequence);
    }
    else if (delete_code != null) {
        number_deletecode = numberSequence;
        delete_flag = true;
        if (status_state == 23) {
            console.log('tutorial_state23_del_flag ', delete_flag, ' num ', number_deletecode);
        } else if (status_state == 26) {
            console.log('tutorial_state26_del_flag ', delete_flag, ' num ', number_deletecode);
        } else if (status_state == 31) {
            console.log('state31_del_flag ', delete_flag, ' num ', number_deletecode)
            deleteCode();
        } else {
            delete_flag = false;
        }
        console.log('he will ', delete_code, 'status-delete ', delete_flag, ' delete_number ', numberSequence);
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
        if (status_state == 16) {
            console.log('tutorial_state16_insert_flag ', insert_flag, ' position ', insert_position, ' number ', number);
        } else if (status_state == 20) {
            console.log('tutorial_state20_insert_flag ', insert_flag, ' position ', insert_position, ' number ', number);
        } else if (status_state == 31) {
            console.log('state31_insert_flag ', insert_flag, ' position ', insert_position, ' number ', number);

        } else {
            number = null;
            insert_position = null;
            insert_flag = false;
        }
    }
    else if (reset != null) {
        if (status_state == 31) {
            for (var ee = 3; ee > -1; ee--) {
                if (ee == 2) {
                    responsetext = 'เหลือหัวใจแค่ 1 ดวงแล้วนะ'
                } else if (ee == 1) {
                    responsetext = 'หัวใจหมดแล้วนะ ใช้คำสั่งเริ่มต้นใหม่ไม่ได้แล้วนะ';
                }
                console.log('reset in true_state ', reset);
                reset_flag = true;
                resetPosition();
                resetArrayOrder();
            }
        }
        console.log('reset ', reset);
    }
    else if (numberSequence != null) {
        if (status_state == 31 && modify_flag == true || insert_flag == true) {
            number = numberSequence;
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
            else if (order == "เลี้ยวซ้าย") {
                order = "left";
            }
            else if (order == "เลี้ยวขวา") {
                order = "right";
            }
            // else if (order == "กลับหลังหัน"){
            //   order = "return";
            //   distance = '2';
            // }
        }
        console.log('sh order', order, 'show distance ', distance);
        if (status_state == 30) {
            ComputePosition();
            keepArrayOrder();
            checkState();
            status_state = 31;
        } else {
            console.log('will access tutorial');
        }
    }
  
    if (status_state == 101 ){
        status_state = 30;
        state = 'maze1';
        maze_state = 'maze1';
    }else if (status_state == 102){
        status_state = 31;
        state = 'maze2';
        maze_state = 'maze2';
    }else if (status_state == 103){
        status_state = 31;
        state = 'maze3';
        maze_state = 'maze3';
    }else if (status_state == 104){
        status_state = 31;
        state = 'maze4';
        maze_state = 'maze4';
    }else if (status_state == 105){
        status_state = 31;
        state = 'maze5';
        maze_state = 'maze5';
    }else if (status_state == 106){
        status_state = 31;
        state = 'maze6';
        maze_state = 'maze6';
    }

    console.log('state ', status_state);

    var maze_tutorial = [[0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0]]

    var order_tutorail = null;
    var position_tutorial = null;

    //tutorial**********************************************************************************************************
    if (status_state == 2.1) {
        status_state = 2;
        state = null;
    }
    else if (status_state == 2) {
        if (already == 'พร้อมแล้ว') {
            responsetext = 'จับตาดูที่ตัวละคร และ สัญลักษณ์ให้ดีนะ เริ่มกันเลย ให้พูดว่า เลี้ยวซ้าย';
            state = 'tutorial_state1-1';
            console.log('access tutorial ', already);
            status_state = 3;
        } else {
            responsetext = 'จะเล่นเกมได้ต้องเรียนก่อนนะ พูดว่า พร้อมแล้ว';
        }
    }
    else if (status_state == 3) {
        if (order == 'left' && distance == '1') {
            responsetext = 'พูดว่า เดิน 3 ช่อง';
            status_state = 4;
        } else {
            responsetext = 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เลี้ยวซ้าย';
        }
        state = null;
    }
    else if (status_state == 4) {
        if (order == 'forward' && distance == '3') {
            responsetext = 'จบแล้วมาทดสอบกันหน่อย ถ้าพร้อมแล้วให้พูดว่า ทดสอบ';
            status_state = 5;
        } else {
            responsetext = 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เดิน 3 ช่อง';
        }
    }
    else if (status_state == 5) {
        if (test_flag) {
            state = 'tutorial_state1-2';
            responsetext = 'ต้องเดินไปเข้าประตูให้ได้นะ';
            status_state = 6;
        } else {
            responsetext = 'ทดสอบง่ายๆ ลองดูหน่อย พูดว่า ทดสอบ';
        }
    }
    else if (status_state == 6) {
        if (order == 'forward' && distance == '2') {
            responsetext = 'ต่อไปจะเรียนการใช้คำสั่งเปลี่ยนนะ สังเกตที่สัญลักษณ์ด้วยนะ ถ้าพร้อมแล้วให้พูดว่า พร้อมแล้ว';
            status_state = 7;
        } else {
            responsetext = 'ยังไม่ถูกนะคะ ลองใหม่อีกครั้งนะ';
        }
        state = null;
    }
    else if (status_state == 7) {
        if (already == 'พร้อมแล้ว') {
            state = 'tutorial_state2-1'
            responsetext = 'พูดว่าเปลี่ยนตัวที่ 2';
            status_state = 8;
        } else {
            responsetext = 'ถ้าจะเล่นต่อ พูดว่าพร้อมแล้ว';
        }
    }
    else if (status_state == 8) {
        if (modify_flag == true && number == '2') {
            responsetext = 'ทีนี้จะเปลี่ยนจากถอยหลังเป็นเดินหน้า ให้พูดว่า เดินหน้า';
            status_state = 9;
        } else {
            responsetext = 'ถ้าจะให้ถูกต้องต้องพูดว่า เปลี่ยนตัวที่ 2';
        }
        state = null;
    }
    else if (status_state == 9) {
        if (order == 'forward' && distance == '1') {
            responsetext = 'ตัวที่ 2 เปลี่ยนเป็น เดินหน้าแล้ว ให้พูดว่าเล่นใหม่';
            status_state = 10;
        } else {
            responsetext = 'ต้องพูดว่าเดินหน้า';
        }
    }
    else if (status_state == 10) {
        if (play_flag == true) {
            responsetext = 'เข้าใจวิธีเล่นรึยังจ๊า งั้นลองทดสอบดูว่าเข้าใจจริงมั้ย พูดว่า ทดสอบ';
            status_state = 11;
        } else {
            responsetext = 'ต้องพูดว่าเล่นใหม่ก่อนนะ';
        }
    }
    else if (status_state == 11) {
        if (test_flag) {
            state = 'tutorial_state2-2';
            responsetext = 'ต้องเดินไปเข้าประตูโดยใช้คำสั่งเปลี่ยน';
            status_state = 12;
        } else {
            responsetext = 'ลองดูหน่อย พูดว่า ทดสอบ';
        }
    }
    else if (status_state == 12) {
        if (modify_flag == true && number == '2') {
            responsetext = 'พูดคำสั่งที่ต้องการเปลี่ยนที่ตัวที่ 2 มาเลย';
            status_state = 13;
        } else {
            responsetext = 'ยังไม่ถูกนะ ลองอีกที';
        }
        state = null;
    }
    else if (status_state == 13) {
        if (order == 'left' && distance == '1') {
            responsetext = 'พูดว่าเล่นใหม่';
            status_state = 14;
        } else {
            responsetext = 'ยังไม่ถูกนะ ลองอีกที';
        }
    }
    else if (status_state == 14) {
        if (play_flag == true) {
            responsetext = 'ยินดีด้วยผ่านแล้ว เรียนคำสั่งเพิ่มต่อ  พูดว่า พร้อมแล้ว';
            status_state = 15;
        } else {
            responsetext = 'ต้องพูดว่าเล่นใหม่';
        }
    }
    else if (status_state == 15) {
        if (already == 'พร้อมแล้ว') {
            state = 'tutorial_state3-1'
            responsetext = 'พูดว่าเพิ่มหลังตัวที่ 1';
            status_state = 16;
        } else {
            responsetext = 'สู้ๆนะมาได้ครึ่งทางแล้วเรียนต่อ พูดว่าพร้อมแล้ว';
        }
    }
    else if (status_state == 16) {
        if (insert_flag == true && insert_position == 'after' && number == '1') {
            responsetext = 'ต้องการเพิ่มคำสั่งเดินหน้าหลังจากเดินมาแล้ว 2 ช่อง ให้พูดว่า เดินหน้า';
            status_state = 17;
        } else {
            responsetext = 'ต้องพูดว่า เพิ่มหลังตัวที่ 1 นะ';
        }
        state = null;
    }
    else if (status_state == 17) {
        if (order == 'forward' && distance == '1') {
            responsetext = 'พูดว่า เล่นใหม่';
            status_state = 18;
        } else {
            responsetext = 'ถ้าจะให้ถูกต้องต้องพูดว่า เดินหน้า นะคะ';
        }
    }
    else if (status_state == 18) {
        if (play_flag == true) {
            num = 6000;
            responsetext = 'เรียนแล้วก็ต้องทดสอบนะจ๊า พูดว่า ทดสอบ';
            status_state = 19;
        } else {
            responsetext = 'ต้องพูดว่า เล่นใหม่ ก่อนนะ';
        }
    }
    else if (status_state == 19) {
        if (test_flag) {
            state = 'tutorial_state3-2';
            responsetext = 'ต้องเดินไปเข้าประตูโดยใช้คำสั่งเพิ่ม';
            status_state = 20;
        } else {
            responsetext = 'ถ้าไม่ได้ทำจะเล่นเกมไม่ได้นะ พูดว่า ทดสอบ'
        }
    }
    else if (status_state == 20) {
        if (insert_flag == true && insert_position == 'after' && number == '3') {
            responsetext = 'พูดคำสั่งที่ต้องการเพิ่มหลังตัวที่ 3 มาเลย';
            status_state = 21;
        } else if (insert_flag == true && insert_position == 'before' && number == '4') {
            responsetext = 'พูดคำสั่งที่ต้องการเพิ่มก่อนตัวที่ 4 มาเลย';
            status_state = 21;
        } else {
            responsetext = 'ยังพูดไม่ถูกนะ ดูดีๆ';
        }
        state = null;
    }
    else if (status_state == 21) {
        if (order == 'right' && distance == '1') {
            responsetext = 'พูดว่า เล่นใหม่';
            status_state = 22;
        } else {
            responsetext = 'ยังพูดไม่ถูกนะ ลองอีกที';
        }
    }
    else if (status_state == 22) {
        if (play_flag == true) {
            num = 6000;
            responsetext = 'เก่งมาก ต่อไปจะเรียนคำสั่งลบนะจ๊า ให้พูดว่า ลบตัวที่ 4';
            status_state = 23;
            state = 'tutorial_state4-1';
        } else {
            responsetext = 'ต้องพูดว่าเล่นใหม่ก่อนนะ';
        }
    }
    else if (status_state == 23) {
        if (delete_flag == true && number_deletecode == '4') {
            responsetext = 'ทีนี้ ลองให้ทำงานตามคำสั่งใหม่ทั้งหมดอีกครั้ง พูดว่า เล่นใหม่';
            status_state = 24;
        } else {
            responsetext = 'แค่ลบตัวที่ 4 ทิ้งนะ';
        }
        state = null;
    }
    else if (status_state == 24) {
        if (play_flag == true) {
            num = 9000;
            responsetext = 'พูดว่า ทดสอบ';
            status_state = 25;
        } else {
            responsetext = 'ต้องพูดว่าเล่นใหม่ก่อนนะ';
        }
    }
    else if (status_state == 25) {
        if (test_flag) {
            state = 'tutorial_state4-2';
            responsetext = 'ต้องเดินไปเข้าประตูโดยใช้คำสั่งลบ';
            status_state = 26;
        } else {
            responsetext = 'คำสั่งสุดท้ายแล้วลองหน่อย พูดว่า ทดสอบ'
        }
    }
    else if (status_state == 26) {
        if (delete_flag == true && number_deletecode == '4') {
            responsetext = 'พูดว่า เล่นใหม่';
            status_state = 27;
        } else {
            responsetext = 'ลบแค่ตัวเดียวก็ได้แล้ว ลองใหม่นะ';
        }
        state = null;
    }
    else if (status_state == 27) {
        if (play_flag == true) {
            state = 'tutorial_state5-1';
            num = 9000;
            responsetext = 'สุดท้ายแล้วตอบคำถามให้ได้ก่อนถึงจะเล่นเกมได้  ตั้งใจฟังนะ การเดินในรูปด้านซ้าย     เกิดจาก    คำสั่งต่างๆ      ในรูปด้านขวา   ถูกหรือ ไม่ถูก';
            status_state = 28;
        } else {
            responsetext = 'ต้องพูดว่าเล่นใหม่ก่อนนะ';
        }
    }
    else if (status_state == 28) {
        if (anser == 'incorrect') {
            responsetext = 'เก่งมากเลยจ๊า เล่นเกมจะต้องเดินเข้าประตูให้ครบ 6 ด่านนะ';
            status_state = 30;
            state = 'maze1';
            maze_state = 'maze1';
        }
        else if (anser == 'correct') {
            state = 'tutorial_state5-2';
            responsetext = 'ยังตอบไม่ถูกนะ ลองข้อใหม่ ดูสิว่า  การเดินของตัวละคร ในด้านซ้าย เกิดจาก คำสั่งของรูปด้านขวา ถูก หรือ ไม่ถูก';
            status_state = 29;
        }
        else {
            responsetext = 'การเดินในรูปด้านซ้าย     เกิดจาก    คำสั่งต่างๆ      ในรูปด้านขวา   ถูกหรือ ไม่ถูก';
        }
    }
    else if (status_state == 29) {
        if (anser == 'correct') {
            responsetext = 'เก่งมากเลยจ๊า เล่นเกมจะต้องเดินเข้าประตูให้ครบ 6 ด่านนะ';
            status_state = 30;
            state = 'maze1';
            maze_state = 'maze1';
        } else {
            responsetext = 'ไม่ผ่านการเรียน เสียใจด้วยนะจ๊า';
        }
    }



//HAVE TO DO *****************************************************************************************************
    if (havetoDo_flag == true && delete_flag == true) {
        havetoDo_flag = false;
        console.log('havetoDo_delete ,', havetoDo_flag);
    }
//function ComputePosition *****************************************************************************************************
    function ComputePosition() {
        console.log('compteposition access');
        if (havetoDo_flag && status_state == 31) {
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
        if (modify_flag && status_state == 31) {
            // console.log('order change is ',order);
            // console.log('distance change is ',distance);
            // console.log('number ',number);
            number = number - 1;
            arrayOrder.splice(number, 1, [order, distance]);
            number = null;
            console.log('arrayOrder from compute mod', arrayOrder);
            // console.log('order change is ',order);
            // console.log('distance change is ',distance);
            // console.log('number ',number);
            // console.log('mo_f ',modify_flag);
            //   }
            // }
        }
        else if (insert_flag && status_state == 31) {
            if (insert_position == 'before') {
                number = number - 1;
                arrayOrder.splice(number, 0, [order, distance]);
                console.log('arrayOrder from compute insert before', arrayOrder);
            } else if (insert_position == 'after') {
                arrayOrder.splice(number, 0, [order, distance]);
                console.log('arrayOrder from compute insert after', arrayOrder);
            }
            number = null;
            insert_position = null;
        }
        else if (havetoDo_flag == false || play_flag == true && status_state == 30) {
            // console.log('order sh ',order);
            // console.log('disance sh ',distance);
            // console.log('in compute sh arr Order ',arrayOrder);
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
                                repeat_flag = true;
                                console.log('access check repeat', repeat_flag);
                            }
                        }
                        position.push([maze_x, maze_y]);
                    } else {
                        responsetext = 'crashing ,you must modify,delete or insert';
                        crash_flag = true;
                        console.log('text clashing');
                    }
                    if (responsetext == 'You can not walk the same route, you must modify,delete or insert.') {
                        position.pop();
                        console.log('do function resetposition when repeat');
                    }
                }
                num = distance * 500;
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
                                console.log('access check repeat', repeat_flag);
                            }
                        }
                        position.push([maze_x, maze_y]);
                    } else {
                        crash_flag = true;
                        responsetext = 'crashing ,you must modify,delete or insert';
                        console.log('text clashing');
                    }
                    if (responsetext == 'You can not walk the same route, you must modify,delete or insert.') {
                        position.pop();
                        console.log('do function resetposition when repeat');
                    }
                }
                num = distance * 500;
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
                num = 500;
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
                num = 500;
            }
            // console.log('in compute sh arr Order ',arrayOrder);

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
        maze_x = 11;
        maze_y = 1;
        direction = 'E';
        if (modify_flag) {
            console.log('mod-flag in play ', modify_flag);
            modify_flag = false;
        }
        else if (insert_flag) {
            console.log('insert-flag in play ', insert_flag);
            insert_flag = false;
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
        var turntime = 500 * arrayOrder.length;
        num = 800 * position.length + turntime;
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
    // console.log('seq ',sequence);
    // console.log('repeat_f ',repeat_flag);
    console.log("playF ", play_flag);
    io.emit('chat', order, distance, insert_flag, modify_flag, number, insert_position, delete_flag, play_flag, state, startgame, character, reset_flag, number_deletecode, anser);
    io.emit('symbols', order, distance, state, reset_flag, modify_flag, insert_flag, delete_flag, number, number_deletecode, play_flag, insert_position, repeat_flag, crash_flag, maze_state, anser);
    order = null;
    distance = null;
    anser = null;
    startgame = null;
    character = null;
    test_flag = false;
    delete_flag = false;
    play_flag = false;
    maze_state = null;
    number_deletecode = null;
    reset_flag = false;
    repeat_flag = false;
    crash_flag = false;

    if (status_state == 9 || status_state == 13) {
        modify_flag = false;
        number = null;
    } else if (status_state == 17 || status_state == 21) {
        insert_flag = false;
        insert_position = null;
        number = null;
    }

    // reset = null
    // var num = distance*1000;
    setTimeout(function () {
        console.log('send already');
        return res.json(responseObj);
    }, num)
    console.log('num ', num);
    num = 500;
    console.log('num ', num);

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

