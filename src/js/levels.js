const levels = {
    easy: [
        {
            mission: 'Match only numbers',
            regex: ['[0-9]', '0-9', '[0123456789]', '[1-9]', '\\d', '/d', 'digits', 'num'],
            match: ['1234', '35345', '32108943', '809342', '7812379', '123'],
            dontMatch: ['Im not a number', 'letter', '$%§&/"%&', '  space  ', '___'],
            isExactMatch: false

        },
        {
            mission: 'Match only letters',
            regex: ['[a-zA-Z]', '/w', '[^0-9]', 'abc', '[^a-z]', 'a-zA-Z', 'letter', '\w'],
            match: ['adsdsa', 'gfggf', 'khjkjkh', 'hjkhh', 'hjkjk'],
            dontMatch: ['/)(§%$', ')(/)/', '32108943', '809342', '7812379'],
            isExactMatch: false
        },
        {
            mission: 'Match "Worm" or "Dog"',
            regex: ['[WormDog]', 'Worm or Dog', '^Cat', '{Worm/Dog}', 'Worm|Dog', 'Dog||Worm', '^Worm|Dog', '^Worm|Dog$'],
            match: ['Worm', 'Dog', 'WormDog', 'My Worm', 'Dogs are cute'],
            dontMatch: ['Wromm Wromm', 'God', 'Not a W0rm', 'Not a D0g',  'Cats are cute'],
            isExactMatch: true
        },
        {
            mission: 'Match a, b & c',
            regex: ['[abc]', 'abc', '^abc$', '{abc}', 'a|b|c', 'a,b,c', '[a-c]', '([abc])?'],
            match: ['abc', 'cba', 'bca', 'abbc', 'ccba'],
            dontMatch: ['The', 'ßird', 'is', 'the',  'Word'],
            isExactMatch: true
        },
        {
            mission: 'Only allow letters, numbers & _',
            regex: ['^[\\w]+$', '\\d\\w[_]', '[A-Z0-9_]', 'a-zA-z0-9', '[a-zA-z0-9_]', '[_a-zA-z0-9]', '.'],
            match: ['Deadpool_2', 'my_folder', 'image_092', '123', 'A_Za_z0_9'],
            dontMatch: ['Why?', '%&/§"(', '/R2D2/', 'my-folder',  'image092.png'],
            isExactMatch: true
        },
        {
            mission: 'Match any character except newline',
            regex: ['[?=)(/&%$§"!A-Za-z0-9]', '.', '[A-Z0-9a-z!-?]', '\\all', '\\.', '\\any/', '.'],
            match: ['abcde83782', 'A-Za-z0-9', '?=)(/&%$§"!', '1236789', 'ABCGHZ'],
            dontMatch: ['\n\n'],
            isExactMatch: false
        },
        {
            mission: 'Match all ',
            regex: ['[?=)(/&%$§"!A-Za-z0-9]', '.', '[A-Z0-9a-z!-?]', '\\all', '\\.', '\\any/', '.'],
            match: ['abcde83782', 'A-Za-z0-9', '?=)(/&%$§"!', '1236789', 'ABCGHZ'],
            dontMatch: ['\n\n'],
            isExactMatch: false
        },
    ],

    normal: [
        {
            mission: 'Match exactly "Worm"',
            regex: ['{Worm}', 'Worm$', '^Worm$', '-Worm$', 'Worm:Worm', '[^Worm$]', '^Worm+$', 'Worm', '\Worm/'],
            match: ['Worm', 'Worm', 'Worm', 'Worm', 'Worm'],
            dontMatch: ['Worms', 'MyWorms', 'Worming', 'Worms are..', 'awesome'],
            isExactMatch: true
        },
        {
            mission: 'Match cat and cats with unlimited "s"',
            regex: ['cat|s*', '[cats s]' , '(cat)s*', '(cat)(s)*', 'cats*', 'cat|cats', 'cat(s*)', 'cat(s)', 'cat|s|s|s|s'],
            match: ['cats', 'catss', 'catsss', 'catsss', 'catssss'],
            dontMatch: ['dogs', 'dooogs', 'cass', 'cast'],
            isExactMatch: true
        },
        {
            mission: 'Match one or more: a, b or c',
            regex: ['[abc]+', '[abc]*' , '(abc)*', '[a]+[b]+[c]+', '([a-c])+', '[a-c]+', 'a*b*c*'],
            match: ['aa', 'bb', 'ccaa', 'abbc', 'aaaabcc'],
            dontMatch: ['123', 'ABCC'],
            isExactMatch: true
        },
    ],
    hard: [
        {
            mission: 'Match exactly "Worm" or "Dog"',
            regex: ['{Worm}', '^Worm|Dog$', '^(Dog)|(Worm)$', 'Worm|Dog', '-Worm$', 'Worm:Worm', '[^Worm$]', '^Worm+$', 'Worm', '\Worm/'],
            match: ['Worm', 'WormWorm', 'DogWormDog', 'MyDogWorm', '!Worm'],
            dontMatch: ['WorDogms', 'MyDogWorms', 'WoormDoogs', 'Worms & Dogs', '!Worm!'],
            isExactMatch: true
        }, 
    ],
    'very hard': [
        {
            mission: 'Match ending with "ing"',
            regex: ['<.*ing\>', 'ing\\b', '^[ing]$', 'ing$', 'end:ing', '[^ing$]', '^ing+$', '[end:]ing', '\ing'],
            match: ['ending', 'living', 'loving', 'hiking', 'balling'],
            dontMatch: ['ingen', 'inga', 'endingme', '0123', 'abcde'],
            isExactMatch: true
        },
    ]
}