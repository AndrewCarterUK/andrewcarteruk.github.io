var image = new Image();
image.src = 'background.jpg';
image.onload = function() {
    draw(this);
}

function draw(img) {
    var canvas = document.getElementById('background');
    var context = canvas.getContext('2d');

    context.drawImage(image, 0, 0);
    image.style.display = 'none';

    var originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var originalData = originalImageData.data;

    var generateMuddledImageData = function(multiple) {
        var newData = new Uint8ClampedArray(originalData);
        var pixels = newData.length / 4;

        for (var i = 0; i < pixels * multiple; i++) {
            var source = Math.floor(Math.random() * pixels);
            var dest = Math.floor(Math.random() * pixels);

            newData[(source * 4) + 0] = originalData[(dest * 4) + 0];
            newData[(source * 4) + 1] = originalData[(dest * 4) + 1];
            newData[(source * 4) + 2] = originalData[(dest * 4) + 2];
            newData[(dest * 4) + 0] = originalData[(source * 4) + 0];
            newData[(dest * 4) + 1] = originalData[(source * 4) + 1];
            newData[(dest * 4) + 2] = originalData[(source * 4) + 2];
        }

        return new ImageData(newData, canvas.width, canvas.height);
    }

    var collections = [
        generateMuddledImageData(2),
        generateMuddledImageData(1.5),
        generateMuddledImageData(1.3),
        generateMuddledImageData(1.1),
        generateMuddledImageData(0.9),
    ];

    var questions = [
        ['Dewey, Ned, Zack and Summer are all characters in which 2003 film?', 'school of rock'],
        ['The fourth song on the fourth album of a band of 4. Released one year over fourty four years ago.', 'stairway to heaven'],
        ['Aussie pop pair that went to the moon and back.', 'savage garden'],
        ['Another aussie. Had trouble texting.', 'shane warne'],
        ['Another aussie. Anagram of "a crocodile", without the "e", with the "l" swapped for an "i" and an "o" swapped for an "r"', 'ricciardo']
    ];

    var question = -1;

    nextQuestion = function () {
        question++;

        if (question >= collections.length) {
            var message = (
                'Happy Christmas Simon!<br /><br />You are going to the MONZA GP, 2017.<br /><br />' +
                '<small>P.S. You are missing the last league game of the season (sorry not sorry) ' +
                'and you will need to book Thurs 31st August off until Monday 4th September.</small><br /><br />'
            );

            $('#question-text').html(message);
            $('#form').hide();
            context.putImageData(originalImageData, 0, 0);
        } else {
            $('#question-text').text(questions[question][0]);
            context.putImageData(collections[question], 0, 0);
        }
    }

    nextQuestion();

    $('#form').submit(function(e) {
        e.preventDefault();

        var answer = $('#answer').val();

        if (answer.toLowerCase() == questions[question][1]) {
            $('#question').animate({ opacity: 0 }, 1000, function () {
                nextQuestion();
                setTimeout(function () {
                    $('#question').animate({opacity: 1}, 1000);
                }, 500);
            });
        }

        $('#answer').val('').focus();
    });
}
