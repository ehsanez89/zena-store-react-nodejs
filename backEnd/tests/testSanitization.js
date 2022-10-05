const {
    checkEmail,
    checkName,
    checkPassword,
    checkDate,
    checkAddress,
    checkProfilePicture,
    checkFiscalCode,
} = require('../utils/sanitization.js');
const pkg = require('chai');
const { expect } = pkg;
const { validationResult } = require('express-validator');
const httpMocks = require('node-mocks-http');

async function testExpressValidatorMiddleware(req, res, middlewares) {
    await Promise.all(
        middlewares.map(async (middleware) => {
            await middleware(req, res, () => undefined);
        }),
    );
}

describe('Email sanitizer', function () {
    async function validateEmail(value) {
        const req = httpMocks.createRequest({
            params: {
                email: value,
            },
        });
        const res = httpMocks.createResponse();
        await testExpressValidatorMiddleware(req, res, [checkEmail('email')]);
        return validationResult(req);
    }

    describe('Valid email', function () {
        it('Simple mail', async function () {
            const result = await validateEmail('test@gmail.com');
            expect(result.isEmpty()).to.be.equal(true);
        });
        it('Simple mail with spaces to be trimmed', async function () {
            const result = await validateEmail('  test@gmail.com   ');
            expect(result.isEmpty()).to.be.equal(true);
        });
        it('Valid complex email', async function () {
            const result = await validateEmail('disposable.style.email.with+symbol@example.com');
            expect(result.isEmpty()).to.be.equal(true);
        });
        it('one-letter local-part', async function () {
            const result = await validateEmail('x@example.co');
            expect(result.isEmpty()).to.be.equal(true);
        });
        it('space between the quotes', async function () {
            const result = await validateEmail('" "@example.org');
            expect(result.isEmpty()).to.be.equal(true);
        });
        it('bangified host route used for uucp mailers', async function () {
            const result = await validateEmail('mailhost!username@example.org');
            expect(result.isEmpty()).to.be.equal(true);
        });
    });

    describe('Invalid email', function () {
        // mostly stolen from https://en.wikipedia.org/wiki/Email_address#Examples
        it('Not an email', async function () {
            const result = await validateEmail('not an email');
            expect(result.isEmpty()).to.be.equal(false);
        });
        it('no @ character', async function () {
            const result = await validateEmail('Abc.example.com');
            expect(result.isEmpty()).to.be.equal(false);
        });
        it('only one @ is allowed outside quotation marks', async function () {
            const result = await validateEmail('A@b@c@example.com');
            expect(result.isEmpty()).to.be.equal(false);
        });
        it('none of the special characters in this local-part are allowed outside quotation marks', async function () {
            const result = await validateEmail('a"b(c)d,e:f;g<h>i[j\\k]l@example.com');
            expect(result.isEmpty()).to.be.equal(false);
        });
        it('quoted strings must be dot separated or the only element making up the local-part', async function () {
            const result = await validateEmail('just"not"right@example.com');
            expect(result.isEmpty()).to.be.equal(false);
        });
        it('spaces, quotes, and backslashes may only exist when within quoted strings and preceded by a backslash', async function () {
            const result = await validateEmail('this is"not\\allowed@example.com');
            expect(result.isEmpty()).to.be.equal(false);
        });
        it('even if escaped (preceded by a backslash), spaces, quotes, and backslashes must still be contained by quotes', async function () {
            const result = await validateEmail('this\\ still\\"not\\\\allowed@example.com');
            expect(result.isEmpty()).to.be.equal(false);
        });
        it('local-part is longer than 64 characters', async function () {
            const result = await validateEmail(
                'not an email1234567890123456789012345678901234567890123456789012345678901234+x@example.com',
            );
            expect(result.isEmpty()).to.be.equal(false);
        });
        it('Underscore is not allowed in domain part', async function () {
            const result = await validateEmail('i_like_underscore@but_its_not_allow_in_this_part.example.com');
            expect(result.isEmpty()).to.be.equal(false);
        });
        it('Empty email', async function () {
            const result = await validateEmail('');
            expect(result.isEmpty()).to.be.equal(false);
        });
    });
});

describe('Name/Surname sanitizer', function () {
    async function validateName(value) {
        const req = httpMocks.createRequest({
            params: {
                name: value,
            },
        });
        const res = httpMocks.createResponse();
        await testExpressValidatorMiddleware(req, res, [checkName('name')]);
        return {
            validation: validationResult(req),
            req: req,
        };
    }

    describe('Valid name', function () {
        it('Simple name', async function () {
            const result = await validateName('Pablito');
            expect(result.validation.isEmpty()).to.be.equal(true);
        });
        it('Simple name with spaces to be trimmed', async function () {
            const result = await validateName('  Pablito  ');
            expect(result.validation.isEmpty()).to.be.equal(true);
            expect(result.req.params.name).to.be.equal('Pablito');
        });
        it('Irregular use of capital letter', async function () {
            const result = await validateName('fRaNcO');
            expect(result.validation.isEmpty()).to.be.equal(true);
        });
        it('Name with spaces', async function () {
            const result = await validateName('Garcilaso De la Vega');
            expect(result.validation.isEmpty()).to.be.equal(true);
        });
    });

    describe('Invalid name', function () {
        it('Empty names', async function () {
            const result = await validateName('');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Too long name with spaces and accents characters', async function () {
            const result = await validateName(
                'Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Cipriano de la Santísima Trinidad Ruiz y Picasso',
            );
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Numbers in names', async function () {
            const result = await validateName('Firpo7');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Special characters in names', async function () {
            const result = await validateName('xX~pussy-destroyer~Xx');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
    });
});
describe('Fiscal Code sanitizer', function () {
    async function validateFC(value) {
        const req = httpMocks.createRequest({
            params: {
                fiscalCode: value,
            },
        });
        const res = httpMocks.createResponse();
        await testExpressValidatorMiddleware(req, res, [checkFiscalCode('fiscalCode')]);
        return {
            validation: validationResult(req),
            req: req,
        };
    }

    describe('Valid Fiscal Code', function () {
        it('Simple fiscal code', async function () {
            const result = await validateFC('trrvcn93a26f839m');
            expect(result.validation.isEmpty()).to.be.equal(true);
            expect(result.req.params.fiscalCode).to.be.equal('TRRVCN93A26F839M');
        });
        it('Simple name with spaces to be trimmed', async function () {
            const result = await validateFC('  trrvcn93a26f839m  ');
            expect(result.validation.isEmpty()).to.be.equal(true);
            expect(result.req.params.fiscalCode).to.be.equal('TRRVCN93A26F839M');
        });
    });

    describe('Invalid fiscal code', function () {
        it('Empty fiscal code', async function () {
            const result = await validateFC('');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('wrong fiscal code format', async function () {
            const result = await validateFC('tRrVcNi3a26f839M');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
    });
});

describe('Date sanitizer', function () {
    describe('Valid date', function () {
        it('Simple date', function () {
            const input = '1997-07-18';
            expect(checkDate(input)).to.be.eql(new Date(1997, 6, 18));
        });
        it('Simple date with spaces to be trimmed', function () {
            expect(checkDate('   1997-07-18  ')).to.be.eql(new Date(1997, 6, 18));
        });
    });

    describe('Invalid birthdate', function () {
        it('Empty birthdate', function () {
            expect(checkDate('')).to.be.equal(null);
        });
        it('Characters in birthdate', function () {
            expect(checkDate('aaaa-21-aa')).to.be.equal(null);
        });
        it('Special characters in names', function () {
            expect(checkDate('Xx-!estròyer~-xX~')).to.be.equal(null);
        });
        it('Date with slash', function () {
            expect(checkDate(' 1997/07/18 ')).to.be.equal(null);
        });
        it('Date with dots', function () {
            expect(checkDate('18.07.1997')).to.be.equal(null);
        });
    });
});

describe('Password sanitizer', function () {
    async function validatePassword(value) {
        const req = httpMocks.createRequest({
            params: {
                password: value,
            },
        });
        const res = httpMocks.createResponse();
        await testExpressValidatorMiddleware(req, res, [checkPassword('password')]);
        return {
            validation: validationResult(req),
            req: req,
        };
    }

    describe('Valid pasword', function () {
        it('Simple password', async function () {
            const result = await validatePassword('1a2B3c. ');
            expect(result.validation.isEmpty()).to.be.equal(true);
        });
        it('Start with capital letter ', async function () {
            const result = await validatePassword('AAAAAAAb1-');
            expect(result.validation.isEmpty()).to.be.equal(true);
        });
        it('Start with special symbol', async function () {
            const result = await validatePassword(' -)!3/A#lé;');
            expect(result.validation.isEmpty()).to.be.equal(true);
        });
    });

    describe('Invalid Password', function () {
        it('Empty Password', async function () {
            const result = await validatePassword('');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Password too short', async function () {
            const result = await validatePassword('Mypa.69');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Password too long (> 100 characters)', async function () {
            const result = await validatePassword(
                '000Mypassword.69999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
            );
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Password without a uppercase letter', async function () {
            const result = await validatePassword('ypassword.69');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Password without a lowercase letter', async function () {
            const result = await validatePassword('MMMMMMMMMMM.69');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Password without a symbol', async function () {
            const result = await validatePassword('Mypassword69');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Password without a number', async function () {
            const result = await validatePassword('Mypassword...');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
    });
});

describe('Address sanitizer', function () {
    async function validateAddress(value) {
        const req = httpMocks.createRequest({
            params: {
                address: value,
            },
        });
        const res = httpMocks.createResponse();
        await testExpressValidatorMiddleware(req, res, [checkAddress('address')]);
        return {
            validation: validationResult(req),
            req: req,
        };
    }
    describe('Valid address', function () {
        it('Simple address', async function () {
            const result = await validateAddress('Via Giudecca 7, 16999, Napoli, NP');
            expect(result.validation.isEmpty()).to.be.equal(true);
        });
        it('Simple address with spaces to be trimmed', async function () {
            const result = await validateAddress('   Via Giudecca 7, 16999, Napoli, NP ');
            expect(result.validation.isEmpty()).to.be.equal(true);
            expect(result.req.params.address).to.be.equal('Via Giudecca 7, 16999, Napoli, NP');
        });
        it('Address with 100 characters', async function () {
            const result = await validateAddress(
                'Via Giudecca Giudecca Giudecca Giudecca Giudecca Giudecca Giudecca Giudecca Giu 7, 80049, Napoli, NP',
            );
            expect(result.validation.isEmpty()).to.be.equal(true);
        });
    });

    describe('Invalid address', function () {
        it('Empty address', async function () {
            const result = await validateAddress('');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address without via/piazza', async function () {
            const result = await validateAddress(', 16999, Napoli, NP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address without cap', async function () {
            const result = await validateAddress('Via Giudecca 7, , Napoli, NP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address without city', async function () {
            const result = await validateAddress('Via Giudecca 7, 16999, , NP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address without province', async function () {
            const result = await validateAddress('Via Giudecca 7, 16999, Napoli, ');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address too long', async function () {
            const result = await validateAddress(
                'Via TOO LONG Giudecca Giudecca Giudecca Giudecca Giudecca Giudecca Giudecca Giudecca Giu 7, 80049, Napoli, NP',
            );
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address with a wrong via/piazza', async function () {
            const result = await validateAddress('Via G!decc#, 16999, Napoli, NP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address with a wrong cap with symbol', async function () {
            const result = await validateAddress('Via Giudecca 7, 16!!5, Napoli, NP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address with a cap too long', async function () {
            const result = await validateAddress('Via Giudecca 7, 1611111115, Napoli, NP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address with a wrong cap with letters', async function () {
            const result = await validateAddress('Via Giudecca 7, 16ccc, Napoli, NP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address with a wrong citta with symbol', async function () {
            const result = await validateAddress('Via Giudecca 7, 16999, Napo!!, NP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address with a wrong city with number', async function () {
            const result = await validateAddress('Via Giudecca 7, 16999, N6po7i, NP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address with a wrong province', async function () {
            const result = await validateAddress('Via Giudecca 7, 16999, Napoli, 3=');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address with a too long province', async function () {
            const result = await validateAddress('Via Giudecca 7, 16999, Napoli, NPPPP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address with too many commas', async function () {
            const result = await validateAddress('Via Giuda, decca, 16999, Napoli, NP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
        it('Address with less commas', async function () {
            const result = await validateAddress('Via Giuda, Napoli, NP');
            expect(result.validation.isEmpty()).to.be.equal(false);
        });
    });
});

describe('Picture sanitizer', function () {
    describe('Valid picture', function () {
        it('Simple picture', function () {
            expect(checkProfilePicture('tests/images/OKsmallest.png', 'OKsmallest.png')).to.be.equal(true);
        });
        it('Huge picture (500kb)', function () {
            expect(checkProfilePicture('tests/images/OKregular.jpg', 'OKregular.jpg')).to.be.equal(true);
        });
    });

    describe('Invalid picture', function () {
        it('Not existing picture', function () {
            expect(checkProfilePicture('nothing', 'nothing.png')).to.be.equal(false);
        });
        it('Not square picture', function () {
            expect(checkProfilePicture('tests/images/not_square.jpg', 'not_square.jpg')).to.be.equal(false);
        });
        it('extension not allowed', function () {
            expect(checkProfilePicture('tests/images/not_square.jpg', 'not_square.mp3')).to.be.equal(false);
        });
        it('Too big picture', function () {
            expect(checkProfilePicture('tests/images/NOTok_biggest.jpg', 'NOTok_biggest.jpg')).to.be.equal(false);
        });
    });
});

// describe('Title sanitizer', function () {
//     describe('Valid title', function () {
//         it('Simple title', function () {
//             const input = 'Help our organization with pruning';
//             expect(checkName(input)).to.be.equal(input);
//         });
//         it('Simple name with spaces to be trimmed', function () {
//             expect(checkName('  Help our organization with pruning  ')).to.be.equal(
//                 'Help our organization with pruning',
//             );
//         }); /*
//         it('With ""', function () {
//             const input = '"Help our organization with pruning"';
//             expect(checkName(input)).to.be.equal(input);
//         });
//         it('Title with ! and dot', function () {
//             const input = 'Help our organization with pruning.!';
//             expect(checkName(input)).to.be.equal(input);
//         }); */
//         it('accents characters', function () {
//             const input = 'María de los Remedios Cipriano de la Santísima Trinidad Ruiz y Picasso';
//             expect(checkName(input)).to.be.equal(null);
//         });
//     });

//     describe('Invalid title', function () {
//         it('Empty title', function () {
//             expect(checkName('')).to.be.equal(null);
//         });

//         it('Numbers in names', function () {
//             expect(checkName('Firpo7')).to.be.equal(null);
//         });
//         it('Special characters in names', function () {
//             expect(checkName('xX~pussy-destroyer~Xx')).to.be.equal(null);
//         });
//     });
// });
