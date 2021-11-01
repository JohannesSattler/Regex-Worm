const levels = [{
        mission: 'Match all numbers',
        regex: ['[0-9]', '/d', '[^a-zA-z]', '0-9', '/d', '[^a-zA-z]', '0-9'],
        match: ['1234', '35345', '32108943', '809342', '7812379'],
        dontMatch: ['ads', 'fdsfsd', '/)(§%$', ')(/)/', '(/??']
    },
    {
        mission: 'Match all letters',
        regex: ['[a-zA-Z]', '/w', '[^0-9]', 'abc'],
        match: ['adsdsa', 'gfggf', 'khjkjkh', 'hjkhh', 'hjkjk'],
        dontMatch: ['/)(§%$', ')(/)/', '32108943', '809342', '7812379']
    },
]