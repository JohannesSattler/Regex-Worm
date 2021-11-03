const levels = {
    easy: [
        {
            mission: 'Match only numbers',
            regex: ['[0-9]', '0-9', '[0123456789]', '[1-9]', '\d', '/d', 'digits', 'num'],
            match: ['1234', '35345', '32108943', '809342', '7812379', '123'],
            dontMatch: ['Im not a number', 'letter', '$%§&/"%&', '  space  ', '___']
        },
        {
            mission: 'Match only letters',
            regex: ['[a-zA-Z]', '/w', '[^0-9]', 'abc', '[^a-z]', 'a-zA-Z', 'letter', '\w'],
            match: ['adsdsa', 'gfggf', 'khjkjkh', 'hjkhh', 'hjkjk'],
            dontMatch: ['/)(§%$', ')(/)/', '32108943', '809342', '7812379']
        },
    ],

    normal: [
        {
            mission: 'Match exactly "Worm"',
            regex: ['{Worm}', 'Worm', '^Worm+$', '-Worm$', 'Worm:Worm', '[^Worm$]', '^Worm+$', 'Worm', '\Worm/'],
            match: ['Worm', 'Worm', 'Worm', 'Worm', 'Worm'],
            dontMatch: ['Worms', 'MyWorms', 'Worming', 'Worms are awesome', 'awesome']
        },
    ],

    hard: [
        {
            mission: 'Match exactly "Worm" or "Dog"',
            regex: ['{Worm}', '^Worm+$', 'Worm|Dog', '-Worm$', 'Worm:Worm', '[^Worm$]', '^Worm+$', 'Worm', '\Worm/'],
            match: ['Worm Dog', 'Worm', 'Dog', 'WormDog', 'Worms'],
            dontMatch: ['WorDogms', 'MyDogWorm', 'WoormDoogs', 'Worms and Dogs are awesome', 'awesome']
        }, 
    ],

    'very hard': [
        {
            mission: 'Match ending with "ing"',
            regex: ['<.*ing\>', 'ing\b', '^[ing]+$', '-ing$', 'end:ing', '[^ing$]', '^ing+$', '[end:]ing', '\ing'],
            match: ['ending', 'living', 'loving', 'hiking', 'balling'],
            dontMatch: ['ingen', 'inga', 'endingme', '0123', 'abcde']
        },
    ]
}