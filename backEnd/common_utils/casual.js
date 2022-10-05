const casual = require('casual');

casual.define('fiscal_code', function () {
    return (
        casual.letter +
        casual.letter +
        casual.letter +
        casual.letter +
        casual.letter +
        casual.letter +
        casual.integer(10, 99) +
        casual.letter +
        casual.integer(10, 99) +
        casual.letter +
        casual.integer(100, 999) +
        casual.letter
    );
})

casual.define('birthdate', function () {
    return (
        casual.date(format = 'DDMMYYYY') 
    );
})


casual.define('address', function () {
    return (
        "Via " + casual.words(n=2) + ", " + casual.integer(10000,99999) + ", " + casual.letter + ", GE"
    );
})

casual.define('password', function () {
    return (
        "Pass" + casual.word + casual.integer(100,999) + "!"
    );
})

